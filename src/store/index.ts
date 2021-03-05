import Vue from 'vue';
import Vuex from 'vuex';
import House from '@/models/House';
import {IPoint} from '@/models/IPoint';
import moment from 'moment';
/* With the server side, using this code: */
 import axios from 'axios';
 /* Without the server side, using this code: */
// import data from '../../public/init.json';

Vue.use(Vuex);

export interface IStore {
	kingsLandingPosition: IPoint;
	winner: House | undefined;
	houses: House[];
	updates: {
		house: House;
		steps: number;
		score: number;
	}[];
}

export default new Vuex.Store({
	state: {
		kingsLandingPosition: {x: 260, y: 470},
		winner: undefined,
		houses: [],
		updates: [],
	} as IStore,
	getters: {
		updates: (state) => state.updates,
		latestUpdate: (state) => state.updates[state.updates.length - 1] || null,
		houses: (state) => state.houses,
		houseByName: (state) => (houseName: string) => state.houses.find(house => house.name === houseName),
		kingsLandingPosition: (state) => state.kingsLandingPosition,
		winner: (state) => state.winner
	},
	mutations: {
		setHouses(state, houses) {
			state.houses = houses;
		},
		setWinner(state, house) {
			state.winner = house;
		},
		updateHouse(state, house) {
			const i = state.houses.findIndex(item => item.id === house.id);
			if (i > -1) {
				Vue.set(state.houses, i, house);
			}
		},
		createNewUpdate(state) {
			if (state.winner) {
				return;
			}
			const randHouse: House = state.houses[Math.floor(Math.random() * state.houses.length)];
			const max = 10;
			const min = 5;
			const randSteps: number = randHouse.name !== 'Lannister'
				 ? Math.floor(Math.random() * (max - min) + min) * randHouse.strength : 0;
			const update = {house: randHouse, steps: randSteps, score: randSteps + 100, timestamp: moment()};
			state.updates.push(update);
		}
	},
	actions: {
		initUpdates({commit, state}) {
			(function loop() {
					const rand = Math.round(Math.random() * (3000 - 500)) + 500;
					setTimeout(function () {
						commit('createNewUpdate');
						if (!state.winner) loop();
					}, rand);
			}());
		},
		getHouses(context) {

			/* With the server side, using this code: */
			axios.get('http://localhost:3000/houses')
			.then(response => {
				const houses = response.data;
				context.commit('setHouses', houses);
				return houses;
			  })
			  .catch(e => {
				  console.log(e)
			  })

			/* Without the server side, using this code: */
			// const houses = data['houses'].map(house => new House(house));
			// context.commit('setHouses', houses);
		},
		updateHouse(context, house) {
			context.commit('updateHouse', house);
		},
		setWinner(context, house) {
			context.commit('setWinner', house);
		},
	},
	modules: {},
});
