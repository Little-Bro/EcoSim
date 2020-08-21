# EcoSim
Very basic ecosystem simulation : prey (bunny) / predator (fox).
I would like to end up with something similar to a genetic algorithm and try to reproduce the 'survival of the fittest' model observed in nature.

It's a p5.js holiday project inspired by Sebastian Lague's video : https://www.youtube.com/watch?v=r_It_X7v-1E  
I am also getting a ton of help from Daniel Shiffman's work
(Youtube channel : https://www.youtube.com/channel/UCvjgXvBlbQiydffZU7m1_aw and book : https://natureofcode.com/)

## Animal behaviour
Bunnies and foxes move in a "Lévy Flight" like movement (https://en.wikipedia.org/wiki/L%C3%A9vy_flight see 'Applications').
They can perceive their immediate surroundings (everything that's within a circle which originates from them).
They are hungry, thirsty, and horny and will either seek food, water or a mate accordingly.

Bunnies will also flee foxes upon seeing them.
