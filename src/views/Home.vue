<template>
  <div class="container">

    <div class="side-panel">
    <h1>Score Board</h1>
	<ul>
		<li v-for="scoreStatus in this.scoreStatuses" :key="scoreStatus.id" v-show="scoreStatus.name!=''">
			<span v-bind:style="{ fontWeight: scoreStatus.text }" > {{ scoreStatus.name }} </span>
			<span style="float: right"> {{ scoreStatus.score }}</span>
		</li>
	</ul>

      <div class="mt-20">
        <h2>Updates</h2>
		<ul>
			<li v-for="updateMessage in this.updatesMessages" :key="updateMessage.date" v-show="updateMessage.message!=''">
				<div> {{ updateMessage.date }} </div>
				<v-divider/>
				<div> House 
					<span class="boldText">{{ updateMessage.houseName }}</span>
					 {{ updateMessage.message }} </div>
			</li>
		</ul>
      </div>
    </div>

    <world-map :houses="houses"></world-map>
  </div>
</template>

<script lang="ts">
	// @ is an alias to /src
	import WorldMap from '@/components/WorldMap.vue';
	import {Component, Vue, Watch} from 'vue-property-decorator';
	import House from '@/models/House';
	import {IPoint} from '@/models/IPoint';
	import {IUpdate} from '@/models/IUpdate';

	@Component({
		name: 'Home',
		components: {WorldMap: WorldMap},
	})
	export default class Home extends Vue {

		// Save 2 arrays of objects for score board
		scoreStatuses = [{id: 0, name: '' , score: 0 ,text: ''}]
		updatesMessages = [{houseName: '', date: '', message: ''}]

		created() {
			this.$store.dispatch('initUpdates');
			this.$store.dispatch('getHouses');
		}	

		/**
     	* watch for updates
     	* TODO: move houses according to updates.
		* @param latestUpdate
		*/
		@Watch('latestUpdate')
		onNewUpdate(latestUpdate: IUpdate) {

			// Save local data
			const updateHouse = latestUpdate.house;
			const pos = updateHouse.position;
			const dest = this.kingsLandingPosition;

			// Calculation the new position & score by current update
			updateHouse.position = this.calcNewPosition(pos.x,pos.y,dest.x,dest.y,latestUpdate.steps);
			
			// At case the score is undefined, it is zero
			if(updateHouse.score == undefined){
				updateHouse.score = 0;
			}
			updateHouse.score += latestUpdate.score;
			this.$store.dispatch('updateHouse',updateHouse);

			// Find curr score Status for update the score board
			const currscoreStatus = this.scoreStatuses.find((currHouse)=> currHouse.id == updateHouse.id)

			// At case the score is not exist, create a new one
			if(currscoreStatus == undefined){
				this.scoreStatuses.push({id: updateHouse.id, name:updateHouse.name , score:updateHouse.score,text:'normal'})
			}
			// At case the score is already exist, update his score
			else{
				currscoreStatus.score = updateHouse.score;
			}

			// Sort the score statuses by score
			this.scoreStatuses.sort((a,b)=>b.score - a.score)

			// Create new data for update messages
			const message = " has moved " + latestUpdate.steps + " steps and gained " + latestUpdate.score + " strength";
			const date = latestUpdate.timestamp.format('MM/DD/YYYY hh:mm:ss')

			// Add new message to the begin of the updates messages
			this.updatesMessages.splice(0,0,{houseName:latestUpdate.house.name, date: date, message: message})

			// At case the position of current update house is equal to kings landing position
			if(updateHouse.name != 'Lannister' && updateHouse.position.x == dest.x && updateHouse.position.y == dest.y){

				// Calculator the winner by the highest score
				const winner = this.calcWinner(updateHouse);
				const currscoreWinner = this.scoreStatuses.find((currHouse)=> currHouse.id == winner.id)

				// Change the font-weight of the winner name text to bold
				if(currscoreWinner != undefined){
					currscoreWinner.text = 'bold';
				}

				// alert winner message after 0.5 second for refresh the element on the screen
				setTimeout(() => {
					alert(winner.name + " has won!");
					window.location.reload();
            	}, 500);
			}
		}

	  	/**
     	* TODO: calculate the new position
		* @param x1 house x position
		* @param y1 house y position
		* @param x2 destination x position
		* @param y2 destination y position
		* @param length number of steps towards destination
		*/
		calcNewPosition(x1: number, y1: number, x2: number, y2: number, length: number): IPoint {
			
			const x = this.calcNewPos(x1,x2,length)
			const y = this.calcNewPos(y1,y2,length)

      		return {x: x, y: y}
		}

		calcNewPos(housePos: number, destPos: number, length: number){

			let calcPos;

			// At case house position is smaller then destination position, add the length
			if(housePos < destPos){
				calcPos = housePos + length
				// Now if calc position is bigger then destination position, save it as destination position
				if(calcPos > destPos){
					calcPos = destPos
				}
			}
			// At case house position is bigger then destination position, subtract the length
			else{
				calcPos = housePos - length
				// Now if calc position is smaller then destination position, save it as destination position
				if(calcPos < destPos){
					calcPos = destPos;
				}
			}
			return calcPos;
		}

	  	/**
     	* TODO: calculate the winner
		* @param house the house fighting the Lannisters
		*/
	  	calcWinner(house: House): House {

			// Get the first house id from the score statuses table (sorted table by score)
			const winHouseID = this.scoreStatuses[0].id;

			// Find the house object from the houses by win house id
			let currHouseWinner = this.houses.find((currHouse)=> currHouse.id == winHouseID)

			// Check that the house winner has found
			if(currHouseWinner != undefined){
				this.$store.dispatch('setWinner',currHouseWinner);
			}
			else{
				currHouseWinner = house;
			}
			return currHouseWinner;
		}
		 
		 /* ------ STORE GETTERS ------ */

		getHouseByName(name: string): House {
			return this.$store.getters.houseByName(name);
		}

	  	get houses(): House[] {
		  return this.$store.getters.houses;
		}

		get updates() {
			return this.$store.getters.updates;
		}

		get latestUpdate() {
			return this.$store.getters.latestUpdate;
		}

		get kingsLandingPosition(): IPoint {
			return this.$store.getters.kingsLandingPosition;
		} 
	}
</script>

<style lang="scss">
  $map-width: calc(1280px * 1.115);
  .container {
    display: flex;

    .side-panel {
      padding: 20px;
      min-width: 360px;
      width: calc(100% - #{$map-width} - 40px);
      text-align: left;

      ul {
        list-style: none;

        li {
          padding: 5px;
        }
      }
    }
  }
  .boldText{
	  font-weight: bold;
  }

  .theme--light.v-divider {
    border-color: rgba(0,0,0,0.12) !important; 
}
  
</style>
