import networks from './networks.js';

export const fromNetworkString = network => {
  const parts = network.split(':');
  network = networks[parts[0]]
  if (parts[1]) {
    if (network[parts[1]]) network = network[parts[1]];

    network.coin_type = 1
  }
	return network;
}
