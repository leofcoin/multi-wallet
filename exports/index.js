import base58check from '@vandeurenglenn/base58check';
import secp256k1 from 'secp256k1';
import typedArraySmartConcat from '@vandeurenglenn/typed-array-smart-concat';
import typedArraySmartDeconcat from '@vandeurenglenn/typed-array-smart-deconcat';
import hashWasm, { createKeccak } from 'hash-wasm';
import { createHash, randombytes, pbkdf2, encrypt, decrypt } from '@leofcoin/crypto';
import wif from '@leofcoin/wif';
import MultiSignature from 'multi-signature';
import varint from 'varint';

var testnets = {
    'leofcoin:olivia': {
        messagePrefix: '\u0019Leofcoin Signed Message:',
        pubKeyHash: 0x73,
        scriptHash: 0x76,
        multiTxHash: 0x8b4125,
        payments: {
            version: 0,
            unspent: 0x1fa443d7 // ounsp
        },
        wif: 0x7D,
        multiCodec: 0x7c4,
        bip32: { public: 0x13BBF2D5, private: 0x13BBCBC5 }
    },
    'bitcoin:testnet': {
        messagePrefix: '\x18Bitcoin Signed Message:\n',
        bech32: 'tb',
        pubKeyHash: 0x6f,
        scriptHash: 0xc4,
        wif: 0xef,
        bip32: {
            public: 0x043587cf,
            private: 0x04358394
        }
    }
};

// https://en.bitcoin.it/wiki/List_of_address_prefixes
/**
 * Main network
 * @return {messagePrefix, pubKeyHash, scriptHash, wif, bip32}
 */
const leofcoin = {
    messagePrefix: '\u0019Leofcoin Signed Message:',
    pubKeyHash: 0x30,
    scriptHash: 0x37,
    multiTxHash: 0x3adeed,
    payments: {
        version: 0,
        unspent: 0x0d6e0327 // Lunsp
    },
    coin_type: 640,
    wif: 0x3F,
    multiCodec: 0x3c4,
    bip32: { public: 0x13BBF2D4, private: 0x13BBCBC4 },
    testnet: testnets['leofcoin:olivia']
};
const bitcoin = {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'bc',
    pubKeyHash: 0x00,
    multiCodec: 0x00,
    scriptHash: 0x05,
    wif: 0x80,
    coin_type: 0,
    bip32: {
        public: 0x0488b21e, private: 0x0488ade4
    },
    testnet: testnets['bitcoin:testnet']
};
const litecoin = {
    messagePrefix: '\x19Litecoin Signed Message:\n',
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    wif: 0xb0,
    bip32: {
        public: 0x019da462,
        private: 0x019d9cfe
    }
};
const ethereum = {
    messagePrefix: '\x19Ethereum Signed Message:\n',
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    bip32: {
        private: 0x0488ADE4, public: 0x0488B21E
    },
    coin_type: 60,
    wif: 0x45,
    multiCodec: 0x3c5
};
/**
 * Our & supported networks
 * @return {leofcoin, olivia}
 */
var networks = {
    leofcoin,
    bitcoin,
    litecoin,
    ethereum
};

const HIGHEST_BIT = 0x80000000;
const { publicKeyCreate, publicKeyVerify, privateKeyVerify, privateKeyTweakAdd, ecdh } = secp256k1;
class HdNode {
    #privateKey;
    #publicKey;
    #chainCode;
    #network;
    #depth;
    #index;
    #parentFingerprint;
    constructor(privateKey, publicKey, chainCode, network, depth = 0, index = 0, parentFingerprint = 0x00000000) {
        this.#privateKey = privateKey;
        this.#publicKey = publicKey;
        this.#chainCode = chainCode;
        this.#network = network || networks.leofcoin;
        this.#depth = depth;
        this.#index = index;
        this.#parentFingerprint = parentFingerprint;
    }
    get network() {
        return this.#network;
    }
    get publicKey() {
        this.#publicKey = this.#publicKey || publicKeyCreate(this.#privateKey, true);
        return this.#publicKey;
    }
    get privateKey() {
        return this.#privateKey;
    }
    get identifier() {
        return this.hash160(this.publicKey);
    }
    get fingerprint() {
        return (async () => (await this.identifier).subarray(0, 4))();
    }
    async hash160(data) {
        const hash = await createHash(data, 'SHA-256');
        return (await hashWasm.createRIPEMD160()).update(new Uint8Array(hash)).digest('binary');
    }
    get isNeutered() {
        return this.#privateKey === undefined;
    }
    get neutered() {
        return new HdNode(undefined, this.#publicKey, this.#chainCode, this.#network, this.#depth, this.#index, this.#parentFingerprint);
    }
    fromPrivateKey(privateKey, chainCode, network) {
        if (!privateKeyVerify(privateKey))
            throw new TypeError('Private key not in range [1, n)');
        return new HdNode(privateKey, publicKeyCreate(privateKey, true), chainCode, network);
    }
    fromPublicKey(publicKey, chainCode, network) {
        // verify the X coordinate is a point on the curve
        if (!publicKeyVerify(publicKey))
            throw new TypeError('Point is not on the curve');
        return new HdNode(undefined, publicKey, chainCode, network);
    }
    async fromSeed(seed, network) {
        if (seed.length < 16)
            throw new TypeError('Seed should be at least 128 bits');
        if (seed.length > 64)
            throw new TypeError('Seed should be at most 512 bits');
        let hash = (await hashWasm.createHMAC(hashWasm.createSHA512(), new TextEncoder().encode('Bitcoin seed')))
            .update(seed)
            .digest('binary');
        const privateKey = hash.subarray(0, 32);
        const chainCode = hash.subarray(32);
        return this.fromPrivateKey(privateKey, chainCode, network);
    }
    async toBase58() {
        const network = this.#network || networks.leofcoin;
        let version = !this.isNeutered
            ? network.bip32.private
            : network.bip32.public;
        const set = [
            new TextEncoder().encode(version.toString()),
            new TextEncoder().encode(this.#depth.toString()),
            new TextEncoder().encode(this.#parentFingerprint.toString()),
            new TextEncoder().encode(this.#index.toString()),
            this.#chainCode
        ];
        if (!this.isNeutered) {
            set.push(new TextEncoder().encode('0'));
            set.push(new Uint8Array(this.privateKey));
        }
        else {
            set.push(new Uint8Array(this.publicKey));
        }
        return base58check.encode(typedArraySmartConcat(set));
    }
    toWIF() {
        if (!this.#privateKey)
            throw new TypeError('Missing private key');
        return wif.encode(this.#network.wif, this.#privateKey, true);
    }
    // https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki#child-key-derivation-ckd-functions
    async derive(index) {
        const isHardened = index >= HIGHEST_BIT;
        let data;
        // Hardened child
        if (isHardened) {
            if (this.isNeutered)
                throw new TypeError('Missing private key for hardened child key');
            // data = 0x00 || ser256(kpar) || ser32(index)
            data = typedArraySmartConcat([
                new TextEncoder().encode('0'),
                this.privateKey,
                new TextEncoder().encode(index.toString())
            ]);
        }
        else {
            data = typedArraySmartConcat([
                this.publicKey,
                new TextEncoder().encode(index.toString())
            ]);
        }
        const hash = (await hashWasm.createHMAC(hashWasm.createSHA512(), this.#chainCode))
            .update(data)
            .digest('binary');
        const privateKey = hash.subarray(0, 32);
        const chainCode = hash.subarray(32);
        // if parse256(privateKey) >= n, proceed with the next value for i
        if (!privateKeyVerify(privateKey))
            return this.derive(index + 1);
        // Private parent key -> private child key
        if (!this.isNeutered) {
            // ki = parse256(privateKey) + kpar (mod n)                
            const ki = privateKeyTweakAdd(this.privateKey, privateKey);
            // In case ki == 0, proceed with the next value for i
            if (ki == null)
                return this.derive(index + 1);
            return new HdNode(ki, null, chainCode, this.#network, this.#depth + 1, index, (await this.fingerprint)[0]);
        }
        function hashfn(x, y) {
            const pubKey = new Uint8Array(33);
            pubKey[0] = (y[31] & 1) === 0 ? 0x02 : 0x03;
            pubKey.set(x, 1);
            return pubKey;
        }
        const Ki = ecdh(this.publicKey, chainCode, { hashfn }, new Uint8Array(33));
        // const Ki = new Uint8Array(ecc.pointAddScalar(this.publicKey, IL, true));
        // In case Ki is the point at infinity, proceed with the next value for i
        if (Ki === null)
            return this.derive(index + 1);
        return new HdNode(undefined, Ki, chainCode, this.#network, this.#depth + 1, index, (await this.fingerprint)[0]);
    }
    deriveHardened(index) {
        // Only derives hardened private keys by default
        return this.derive(index + HIGHEST_BIT);
    }
    async derivePath(path) {
        let splitPath = path.split('/');
        if (splitPath[0] === 'm') {
            if (this.#parentFingerprint)
                throw new TypeError('Expected master, got child');
            splitPath = splitPath.slice(1);
        }
        let prevHd = this;
        for (const indexString of splitPath) {
            let index;
            if (indexString.slice(-1) === `'`) {
                index = parseInt(indexString.slice(0, -1), 10);
                prevHd = await prevHd.deriveHardened(index);
            }
            else {
                index = parseInt(indexString, 10);
                prevHd = await prevHd.derive(index);
            }
        }
        return prevHd;
    }
    async fromBase58(string, network) {
        let buffer = (await base58check.decode(string)).data;
        network = network || networks.leofcoin;
        // 4 bytes: version bytes
        let [version, depth, parentFingerprint, index, chainCode, k, privateKey] = typedArraySmartDeconcat(buffer);
        version = Number(new TextDecoder().decode(version));
        depth = Number(new TextDecoder().decode(depth));
        parentFingerprint = Number(new TextDecoder().decode(parentFingerprint));
        index = Number(new TextDecoder().decode(index));
        k = privateKey ? 0 : k;
        if (version !== network.bip32.private && version !== network.bip32.public)
            throw new TypeError('Invalid network version');
        if (depth === 0) {
            if (parentFingerprint !== 0)
                throw new TypeError('Invalid parent fingerprint');
        }
        if (depth === 0 && index !== 0)
            throw new TypeError('Invalid index');
        if (version === network.bip32.private) {
            if (k !== 0x00)
                throw new TypeError('Invalid private key');
            return new HdNode(privateKey, undefined, chainCode, network, depth, index, parentFingerprint);
        }
        return new HdNode(undefined, k, chainCode, network, depth, index, parentFingerprint);
    }
}

const fromNetworkString = network => {
    const parts = network.split(':');
    network = networks[parts[0]];
    if (parts[1]) {
        if (network[parts[1]])
            network = network[parts[1]];
        network.coin_type = 1;
    }
    return network;
};

// see https://github.com/bitcoin/bips/blob/master/bip-0039/english.txt

var wordlist = ["abandon","ability","able","about","above","absent","absorb","abstract","absurd","abuse","access","accident","account","accuse","achieve","acid","acoustic","acquire","across","act","action","actor","actress","actual","adapt","add","addict","address","adjust","admit","adult","advance","advice","aerobic","affair","afford","afraid","again","age","agent","agree","ahead","aim","air","airport","aisle","alarm","album","alcohol","alert","alien","all","alley","allow","almost","alone","alpha","already","also","alter","always","amateur","amazing","among","amount","amused","analyst","anchor","ancient","anger","angle","angry","animal","ankle","announce","annual","another","answer","antenna","antique","anxiety","any","apart","apology","appear","apple","approve","april","arch","arctic","area","arena","argue","arm","armed","armor","army","around","arrange","arrest","arrive","arrow","art","artefact","artist","artwork","ask","aspect","assault","asset","assist","assume","asthma","athlete","atom","attack","attend","attitude","attract","auction","audit","august","aunt","author","auto","autumn","average","avocado","avoid","awake","aware","away","awesome","awful","awkward","axis","baby","bachelor","bacon","badge","bag","balance","balcony","ball","bamboo","banana","banner","bar","barely","bargain","barrel","base","basic","basket","battle","beach","bean","beauty","because","become","beef","before","begin","behave","behind","believe","below","belt","bench","benefit","best","betray","better","between","beyond","bicycle","bid","bike","bind","biology","bird","birth","bitter","black","blade","blame","blanket","blast","bleak","bless","blind","blood","blossom","blouse","blue","blur","blush","board","boat","body","boil","bomb","bone","bonus","book","boost","border","boring","borrow","boss","bottom","bounce","box","boy","bracket","brain","brand","brass","brave","bread","breeze","brick","bridge","brief","bright","bring","brisk","broccoli","broken","bronze","broom","brother","brown","brush","bubble","buddy","budget","buffalo","build","bulb","bulk","bullet","bundle","bunker","burden","burger","burst","bus","business","busy","butter","buyer","buzz","cabbage","cabin","cable","cactus","cage","cake","call","calm","camera","camp","can","canal","cancel","candy","cannon","canoe","canvas","canyon","capable","capital","captain","car","carbon","card","cargo","carpet","carry","cart","case","cash","casino","castle","casual","cat","catalog","catch","category","cattle","caught","cause","caution","cave","ceiling","celery","cement","census","century","cereal","certain","chair","chalk","champion","change","chaos","chapter","charge","chase","chat","cheap","check","cheese","chef","cherry","chest","chicken","chief","child","chimney","choice","choose","chronic","chuckle","chunk","churn","cigar","cinnamon","circle","citizen","city","civil","claim","clap","clarify","claw","clay","clean","clerk","clever","click","client","cliff","climb","clinic","clip","clock","clog","close","cloth","cloud","clown","club","clump","cluster","clutch","coach","coast","coconut","code","coffee","coil","coin","collect","color","column","combine","come","comfort","comic","common","company","concert","conduct","confirm","congress","connect","consider","control","convince","cook","cool","copper","copy","coral","core","corn","correct","cost","cotton","couch","country","couple","course","cousin","cover","coyote","crack","cradle","craft","cram","crane","crash","crater","crawl","crazy","cream","credit","creek","crew","cricket","crime","crisp","critic","crop","cross","crouch","crowd","crucial","cruel","cruise","crumble","crunch","crush","cry","crystal","cube","culture","cup","cupboard","curious","current","curtain","curve","cushion","custom","cute","cycle","dad","damage","damp","dance","danger","daring","dash","daughter","dawn","day","deal","debate","debris","decade","december","decide","decline","decorate","decrease","deer","defense","define","defy","degree","delay","deliver","demand","demise","denial","dentist","deny","depart","depend","deposit","depth","deputy","derive","describe","desert","design","desk","despair","destroy","detail","detect","develop","device","devote","diagram","dial","diamond","diary","dice","diesel","diet","differ","digital","dignity","dilemma","dinner","dinosaur","direct","dirt","disagree","discover","disease","dish","dismiss","disorder","display","distance","divert","divide","divorce","dizzy","doctor","document","dog","doll","dolphin","domain","donate","donkey","donor","door","dose","double","dove","draft","dragon","drama","drastic","draw","dream","dress","drift","drill","drink","drip","drive","drop","drum","dry","duck","dumb","dune","during","dust","dutch","duty","dwarf","dynamic","eager","eagle","early","earn","earth","easily","east","easy","echo","ecology","economy","edge","edit","educate","effort","egg","eight","either","elbow","elder","electric","elegant","element","elephant","elevator","elite","else","embark","embody","embrace","emerge","emotion","employ","empower","empty","enable","enact","end","endless","endorse","enemy","energy","enforce","engage","engine","enhance","enjoy","enlist","enough","enrich","enroll","ensure","enter","entire","entry","envelope","episode","equal","equip","era","erase","erode","erosion","error","erupt","escape","essay","essence","estate","eternal","ethics","evidence","evil","evoke","evolve","exact","example","excess","exchange","excite","exclude","excuse","execute","exercise","exhaust","exhibit","exile","exist","exit","exotic","expand","expect","expire","explain","expose","express","extend","extra","eye","eyebrow","fabric","face","faculty","fade","faint","faith","fall","false","fame","family","famous","fan","fancy","fantasy","farm","fashion","fat","fatal","father","fatigue","fault","favorite","feature","february","federal","fee","feed","feel","female","fence","festival","fetch","fever","few","fiber","fiction","field","figure","file","film","filter","final","find","fine","finger","finish","fire","firm","first","fiscal","fish","fit","fitness","fix","flag","flame","flash","flat","flavor","flee","flight","flip","float","flock","floor","flower","fluid","flush","fly","foam","focus","fog","foil","fold","follow","food","foot","force","forest","forget","fork","fortune","forum","forward","fossil","foster","found","fox","fragile","frame","frequent","fresh","friend","fringe","frog","front","frost","frown","frozen","fruit","fuel","fun","funny","furnace","fury","future","gadget","gain","galaxy","gallery","game","gap","garage","garbage","garden","garlic","garment","gas","gasp","gate","gather","gauge","gaze","general","genius","genre","gentle","genuine","gesture","ghost","giant","gift","giggle","ginger","giraffe","girl","give","glad","glance","glare","glass","glide","glimpse","globe","gloom","glory","glove","glow","glue","goat","goddess","gold","good","goose","gorilla","gospel","gossip","govern","gown","grab","grace","grain","grant","grape","grass","gravity","great","green","grid","grief","grit","grocery","group","grow","grunt","guard","guess","guide","guilt","guitar","gun","gym","habit","hair","half","hammer","hamster","hand","happy","harbor","hard","harsh","harvest","hat","have","hawk","hazard","head","health","heart","heavy","hedgehog","height","hello","helmet","help","hen","hero","hidden","high","hill","hint","hip","hire","history","hobby","hockey","hold","hole","holiday","hollow","home","honey","hood","hope","horn","horror","horse","hospital","host","hotel","hour","hover","hub","huge","human","humble","humor","hundred","hungry","hunt","hurdle","hurry","hurt","husband","hybrid","ice","icon","idea","identify","idle","ignore","ill","illegal","illness","image","imitate","immense","immune","impact","impose","improve","impulse","inch","include","income","increase","index","indicate","indoor","industry","infant","inflict","inform","inhale","inherit","initial","inject","injury","inmate","inner","innocent","input","inquiry","insane","insect","inside","inspire","install","intact","interest","into","invest","invite","involve","iron","island","isolate","issue","item","ivory","jacket","jaguar","jar","jazz","jealous","jeans","jelly","jewel","job","join","joke","journey","joy","judge","juice","jump","jungle","junior","junk","just","kangaroo","keen","keep","ketchup","key","kick","kid","kidney","kind","kingdom","kiss","kit","kitchen","kite","kitten","kiwi","knee","knife","knock","know","lab","label","labor","ladder","lady","lake","lamp","language","laptop","large","later","latin","laugh","laundry","lava","law","lawn","lawsuit","layer","lazy","leader","leaf","learn","leave","lecture","left","leg","legal","legend","leisure","lemon","lend","length","lens","leopard","lesson","letter","level","liar","liberty","library","license","life","lift","light","like","limb","limit","link","lion","liquid","list","little","live","lizard","load","loan","lobster","local","lock","logic","lonely","long","loop","lottery","loud","lounge","love","loyal","lucky","luggage","lumber","lunar","lunch","luxury","lyrics","machine","mad","magic","magnet","maid","mail","main","major","make","mammal","man","manage","mandate","mango","mansion","manual","maple","marble","march","margin","marine","market","marriage","mask","mass","master","match","material","math","matrix","matter","maximum","maze","meadow","mean","measure","meat","mechanic","medal","media","melody","melt","member","memory","mention","menu","mercy","merge","merit","merry","mesh","message","metal","method","middle","midnight","milk","million","mimic","mind","minimum","minor","minute","miracle","mirror","misery","miss","mistake","mix","mixed","mixture","mobile","model","modify","mom","moment","monitor","monkey","monster","month","moon","moral","more","morning","mosquito","mother","motion","motor","mountain","mouse","move","movie","much","muffin","mule","multiply","muscle","museum","mushroom","music","must","mutual","myself","mystery","myth","naive","name","napkin","narrow","nasty","nation","nature","near","neck","need","negative","neglect","neither","nephew","nerve","nest","net","network","neutral","never","news","next","nice","night","noble","noise","nominee","noodle","normal","north","nose","notable","note","nothing","notice","novel","now","nuclear","number","nurse","nut","oak","obey","object","oblige","obscure","observe","obtain","obvious","occur","ocean","october","odor","off","offer","office","often","oil","okay","old","olive","olympic","omit","once","one","onion","online","only","open","opera","opinion","oppose","option","orange","orbit","orchard","order","ordinary","organ","orient","original","orphan","ostrich","other","outdoor","outer","output","outside","oval","oven","over","own","owner","oxygen","oyster","ozone","pact","paddle","page","pair","palace","palm","panda","panel","panic","panther","paper","parade","parent","park","parrot","party","pass","patch","path","patient","patrol","pattern","pause","pave","payment","peace","peanut","pear","peasant","pelican","pen","penalty","pencil","people","pepper","perfect","permit","person","pet","phone","photo","phrase","physical","piano","picnic","picture","piece","pig","pigeon","pill","pilot","pink","pioneer","pipe","pistol","pitch","pizza","place","planet","plastic","plate","play","please","pledge","pluck","plug","plunge","poem","poet","point","polar","pole","police","pond","pony","pool","popular","portion","position","possible","post","potato","pottery","poverty","powder","power","practice","praise","predict","prefer","prepare","present","pretty","prevent","price","pride","primary","print","priority","prison","private","prize","problem","process","produce","profit","program","project","promote","proof","property","prosper","protect","proud","provide","public","pudding","pull","pulp","pulse","pumpkin","punch","pupil","puppy","purchase","purity","purpose","purse","push","put","puzzle","pyramid","quality","quantum","quarter","question","quick","quit","quiz","quote","rabbit","raccoon","race","rack","radar","radio","rail","rain","raise","rally","ramp","ranch","random","range","rapid","rare","rate","rather","raven","raw","razor","ready","real","reason","rebel","rebuild","recall","receive","recipe","record","recycle","reduce","reflect","reform","refuse","region","regret","regular","reject","relax","release","relief","rely","remain","remember","remind","remove","render","renew","rent","reopen","repair","repeat","replace","report","require","rescue","resemble","resist","resource","response","result","retire","retreat","return","reunion","reveal","review","reward","rhythm","rib","ribbon","rice","rich","ride","ridge","rifle","right","rigid","ring","riot","ripple","risk","ritual","rival","river","road","roast","robot","robust","rocket","romance","roof","rookie","room","rose","rotate","rough","round","route","royal","rubber","rude","rug","rule","run","runway","rural","sad","saddle","sadness","safe","sail","salad","salmon","salon","salt","salute","same","sample","sand","satisfy","satoshi","sauce","sausage","save","say","scale","scan","scare","scatter","scene","scheme","school","science","scissors","scorpion","scout","scrap","screen","script","scrub","sea","search","season","seat","second","secret","section","security","seed","seek","segment","select","sell","seminar","senior","sense","sentence","series","service","session","settle","setup","seven","shadow","shaft","shallow","share","shed","shell","sheriff","shield","shift","shine","ship","shiver","shock","shoe","shoot","shop","short","shoulder","shove","shrimp","shrug","shuffle","shy","sibling","sick","side","siege","sight","sign","silent","silk","silly","silver","similar","simple","since","sing","siren","sister","situate","six","size","skate","sketch","ski","skill","skin","skirt","skull","slab","slam","sleep","slender","slice","slide","slight","slim","slogan","slot","slow","slush","small","smart","smile","smoke","smooth","snack","snake","snap","sniff","snow","soap","soccer","social","sock","soda","soft","solar","soldier","solid","solution","solve","someone","song","soon","sorry","sort","soul","sound","soup","source","south","space","spare","spatial","spawn","speak","special","speed","spell","spend","sphere","spice","spider","spike","spin","spirit","split","spoil","sponsor","spoon","sport","spot","spray","spread","spring","spy","square","squeeze","squirrel","stable","stadium","staff","stage","stairs","stamp","stand","start","state","stay","steak","steel","stem","step","stereo","stick","still","sting","stock","stomach","stone","stool","story","stove","strategy","street","strike","strong","struggle","student","stuff","stumble","style","subject","submit","subway","success","such","sudden","suffer","sugar","suggest","suit","summer","sun","sunny","sunset","super","supply","supreme","sure","surface","surge","surprise","surround","survey","suspect","sustain","swallow","swamp","swap","swarm","swear","sweet","swift","swim","swing","switch","sword","symbol","symptom","syrup","system","table","tackle","tag","tail","talent","talk","tank","tape","target","task","taste","tattoo","taxi","teach","team","tell","ten","tenant","tennis","tent","term","test","text","thank","that","theme","then","theory","there","they","thing","this","thought","three","thrive","throw","thumb","thunder","ticket","tide","tiger","tilt","timber","time","tiny","tip","tired","tissue","title","toast","tobacco","today","toddler","toe","together","toilet","token","tomato","tomorrow","tone","tongue","tonight","tool","tooth","top","topic","topple","torch","tornado","tortoise","toss","total","tourist","toward","tower","town","toy","track","trade","traffic","tragic","train","transfer","trap","trash","travel","tray","treat","tree","trend","trial","tribe","trick","trigger","trim","trip","trophy","trouble","truck","true","truly","trumpet","trust","truth","try","tube","tuition","tumble","tuna","tunnel","turkey","turn","turtle","twelve","twenty","twice","twin","twist","two","type","typical","ugly","umbrella","unable","unaware","uncle","uncover","under","undo","unfair","unfold","unhappy","uniform","unique","unit","universe","unknown","unlock","until","unusual","unveil","update","upgrade","uphold","upon","upper","upset","urban","urge","usage","use","used","useful","useless","usual","utility","vacant","vacuum","vague","valid","valley","valve","van","vanish","vapor","various","vast","vault","vehicle","velvet","vendor","venture","venue","verb","verify","version","very","vessel","veteran","viable","vibrant","vicious","victory","video","view","village","vintage","violin","virtual","virus","visa","visit","visual","vital","vivid","vocal","voice","void","volcano","volume","vote","voyage","wage","wagon","wait","walk","wall","walnut","want","warfare","warm","warrior","wash","wasp","waste","water","wave","way","wealth","weapon","wear","weasel","weather","web","wedding","weekend","weird","welcome","west","wet","whale","what","wheat","wheel","when","where","whip","whisper","wide","width","wife","wild","will","win","window","wine","wing","wink","winner","winter","wire","wisdom","wise","wish","witness","wolf","woman","wonder","wood","wool","word","work","world","worry","worth","wrap","wreck","wrestle","wrist","write","wrong","yard","year","yellow","you","young","youth","zebra","zero","zone","zoo"];

class Mnemonic {
  constructor(options = {}) {
    if (!options.wordlist) this.wordlist = wordlist; // english always loaded, rest included by dev
    else this.wordlist = options.wordlist;
  }

  lpad(string, padString, length) {
    while (string.length < length) {
        string = padString + string;
    }
    return string;
  }

  normalize(string) {
    return (string || '').normalize('NFKD');
  }

  bytesToBinary(bytes) {
    return bytes.map(byte => this.lpad(byte.toString(2), '0', 8)).join('');
  }

  async deriveChecksumBits(entropyBuffer) {
    const entropy = entropyBuffer.length * 8;
    const cs = entropy / 32;
    const hash = await createHash(entropyBuffer, 'SHA-512');
    return this.bytesToBinary(Array.from(hash)).slice(0, cs);
  }

  async mnemonicFromEntropy(entropy) {
    if (!Buffer.isBuffer(entropy)) entropy = Buffer.from(entropy, 'hex');
    let checksum = await this.deriveChecksumBits(entropy);
    entropy = this.bytesToBinary(Array.from(entropy));
    let bits = entropy + checksum;
    bits = bits.match(/(.{1,11})/g);
    return bits.map(binary => {
      const index = parseInt(binary, 2);
      return this.wordlist[index]
    }).join(' ')
  }

  /**
   * 
   * @param {Number} strength 256 / 8 = 32 = 24 words
   * @returns {String}
   */
  generate(strength = 256) {
    return this.mnemonicFromEntropy(randombytes(256 / 8))
  }

  salt(password) {
    return 'mnemonic' + this.normalize(password);
  }

  seedFromMnemonic(mnemonic, password, strength = 256, iterations = 2048) {
    const encoder =new TextEncoder();
    return pbkdf2(
      encoder.encode(this.salt(password)),
      encoder.encode(this.normalize(mnemonic)),
      iterations,
      strength,
      'SHA-512')
  }
}

const publicKeyToEthereumAddress = async (publicKeyBuffer) => {
    const hasher = await createKeccak(256);
    hasher.update(publicKeyBuffer);
    const hash = hasher.digest();
    return `0x${hash.slice(-40).toString('hex')}`;
};

class HDWallet {
    hdnode;
    networkName;
    version;
    locked;
    network;
    multiCodec;
    get privateKey() {
        return this.ifNotLocked(() => this.hdnode.privateKey);
    }
    get publicKey() {
        return this.hdnode.publicKey;
    }
    async ethereumAddress() {
        const address = await publicKeyToEthereumAddress(this.publicKey);
        return address;
    }
    leofcoinAddress() {
        return base58check.encode(this.publicKey);
    }
    get address() {
        return this.getAddressForCoin();
    }
    async getAddressForCoin(coin_type) {
        if (!coin_type)
            coin_type = this.network.coin_type;
        if (coin_type === 1) {
            if (this.networkName?.split(':')[0] === 'ethereum')
                coin_type = 60;
            if (this.networkName?.split(':')[0] === 'leofcoin')
                coin_type = 640;
        }
        // if (coin_type === 0) return this.bitcoinAddress
        if (coin_type === 60)
            return this.ethereumAddress();
        if (coin_type === 640)
            return this.leofcoinAddress();
    }
    get accountAddress() {
        return this.ifNotLocked(async () => base58check.encode(this.hdnode.publicKey));
    }
    get isTestnet() {
        return this.network.coin_type === 1;
    }
    constructor(network, hdnode) {
        if (typeof network === 'string') {
            this.networkName = network;
            this.network = fromNetworkString(network);
        }
        else if (typeof network === 'object')
            this.network = network;
        this.multiCodec = this.network.multiCodec;
        this.version = 0x00;
        if (hdnode)
            this.defineHDNode(hdnode);
    }
    ifNotLocked(fn, params) {
        if (this.locked)
            return;
        return params ? fn(...params) : fn();
    }
    async defineHDNode(value) {
        Object.defineProperty(this, 'hdnode', {
            configurable: false,
            writable: false,
            value: await value
        });
    }
    validateNetwork(network) {
        if (!network && !this.network)
            return console.error(`expected network to be defined`);
        if (!network && this.network)
            network = this.network;
        if (typeof network === 'string')
            network = fromNetworkString(network);
        if (typeof network !== 'object')
            return console.error('network not found');
        return network;
    }
    async generate(password, network) {
        network = this.validateNetwork(network);
        const mnemonic = await new Mnemonic().generate(512);
        const seed = await new Mnemonic().seedFromMnemonic(mnemonic, password, 512);
        await this.defineHDNode(await (new HdNode()).fromSeed(new Uint8Array(seed), network));
        return mnemonic;
    }
    /**
   * recover using mnemonic (recovery word list)
   */
    async recover(mnemonic, password, network) {
        network = this.validateNetwork(network || password);
        const seed = await new Mnemonic().seedFromMnemonic(mnemonic, password, 512);
        let node = new HdNode();
        node = await node.fromSeed(new Uint8Array(seed), network);
        await this.defineHDNode(await node.fromSeed(new Uint8Array(seed), network));
    }
    async load(base58, network) {
        network = this.validateNetwork(network);
        await this.defineHDNode(await (new HdNode()).fromBase58(base58, network));
    }
    save() {
        return this.hdnode.toBase58();
    }
    async fromAddress(address, chainCode, network) {
        network = this.validateNetwork(network);
        address = (await base58check.decode(address)).data;
        if (!chainCode || chainCode && !Buffer.isBuffer(chainCode))
            chainCode = address.slice(1);
        await this.defineHDNode(await (new HdNode()).fromPublicKey(address, chainCode, network));
    }
    async fromPublicKey(hex, chainCode, network) {
        network = this.validateNetwork(network);
        if (!chainCode || chainCode)
            chainCode = hex.slice(1);
        let node = new HdNode();
        node = await node.fromPublicKey(hex, chainCode, network);
        await this.defineHDNode(node);
        return this;
    }
}

class MultiWallet extends HDWallet {
    #encrypted;
    constructor(network, hdnode) {
        super(network, hdnode);
    }
    get id() {
        return base58check.encode(typedArraySmartConcat([
            new TextEncoder().encode(this.version.toString()),
            this.account(0).hdnode.neutered.publicKey
        ]));
    }
    get multiWIF() {
        return this.ifNotLocked(async () => this.encode());
    }
    get neutered() {
        return new HDAccount(this.networkName, this, this.hdnode.depth);
    }
    async fromId(id) {
        let buffer = (await base58check.decode(id)).data;
        varint.decode(buffer);
        buffer = buffer.slice(varint.decode.bytes);
        this.fromPublicKey(buffer, null, this.networkName);
    }
    async lock(multiWIF) {
        if (!multiWIF)
            multiWIF = this.multiWIF;
        this.#encrypted = await encrypt(multiWIF);
        this.locked = true;
        return this.#encrypted;
    }
    async unlock({ key, iv, cipher }) {
        const decrypted = await decrypt({ cipher, key, iv });
        await this.import(new TextDecoder().decode(decrypted));
        this.locked = false;
    }
    export() {
        return this.encode();
    }
    /**
     * encodes the multiWIF and loads wallet from bs58
     *
     * @param {multiWIF} multiWIF - note a multiWIF is not the same as a wif
     */
    async import(multiWIF) {
        const { bs58, version, multiCodec } = await this.decode(multiWIF);
        this.network = Object.values(networks).reduce((p, c) => {
            if (c.multiCodec === multiCodec)
                return c;
            else if (c.testnet && c.testnet.multiCodec === multiCodec)
                return c.testnet;
            else
                return p;
        }, networks['leofcoin']);
        await this.load(bs58, this.networkName);
    }
    /**
     * @return base58Check encoded string
     */
    async encode() {
        const { data, prefix } = await base58check.decode(await this.save());
        return base58check.encode(typedArraySmartConcat([
            new TextEncoder().encode(this.version.toString()),
            new TextEncoder().encode(this.multiCodec.toString()),
            prefix,
            data,
        ]));
    }
    async decode(bs58) {
        let [version, multiCodec, prefix, data] = typedArraySmartDeconcat((await base58check.decode(bs58)).data);
        version = Number(new TextDecoder().decode(version));
        multiCodec = Number(new TextDecoder().decode(multiCodec));
        bs58 = await base58check.encode(data, prefix);
        if (version !== this.version)
            throw TypeError('Invalid version');
        if (this.multiCodec !== multiCodec)
            throw TypeError('Invalid multiCodec');
        return { version, multiCodec, bs58 };
    }
    sign(hash) {
        return new MultiSignature(this.version, this.network.multiCodec)
            .sign(hash, this.privateKey);
    }
    verify(multiSignature, hash) {
        return new MultiSignature(this.version, this.network.multiCodec)
            .verify(multiSignature, hash, this.publicKey);
    }
    /**
     * @param {number} account - account to return chain for
     * @return { internal(addressIndex), external(addressIndex) }
     */
    account(index) {
        return new HDAccount(this.networkName, this, index);
    }
    /**
     * m / purpose' / coin_type' / account' / change / aadress_index
     *
     * see https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
     */
    async derivePath(path) {
        return new MultiWallet(this.networkName, await this.hdnode.derivePath(path));
    }
    async derive(index) {
        return new MultiWallet(this.networkName, await this.hdnode.derive(index));
    }
    async fromAccount(privateKey, depth, network) {
        const node = await new MultiWallet(network).fromPrivateKey(privateKey);
        return new HDAccount(node, depth);
    }
}
// TODO: multihash addresses
class HDAccount extends MultiWallet {
    /**
     * @param {number} depth - acount depth
     */
    constructor(network, hdnode, depth = 0) {
        super(network, hdnode);
        this.hdnode = hdnode;
        this.depth = depth;
        this._prefix = `m/44'/${hdnode.network.coin_type}'/${depth}'/`;
    }
    /**
     * @param {number} index - address index
     */
    async internal(index = 0) {
        return this.hdnode.derivePath(`${this._prefix}1/${index}`);
    }
    /**
     * @param {number} index - address index
     */
    async external(index = 0) {
        return this.hdnode.derivePath(`${this._prefix}0/${index}`);
    }
}

export { MultiWallet as default };
