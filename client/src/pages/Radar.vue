<template>
	<v-ons-page>
		<v-ons-card>
			<div class="center">
				<div class="pulse"></div>
			</div>
			<p>Distance : {{ dist }}m</p>
		</v-ons-card>
      <p  style="text-align:center;margin-top:20px; ">
        <v-ons-button @click="next">Suivant</v-ons-button>
      </p>
	</v-ons-page>
</template>

<script>
export default {
	data() {
		return {
			dist: 10000
		}
	},
	computed: {},
	props: ['poi'],
	mounted() {
		let options = {
			enableHighAccuracy: true,
			timeout: 1000,
			maximumAge: 0
		}
		navigator.geolocation.getCurrentPosition(
			this.locationfound,
			this.locationerror,
			options
		)
		navigator.geolocation.watchPosition(
			this.locationfound,
			this.locationerror,
			options
		)
	},
	methods: {
		distance(lat1, lon1, lat2, lon2, unit) {
			var radlat1 = (Math.PI * lat1) / 180
			var radlat2 = (Math.PI * lat2) / 180
			var theta = lon1 - lon2
			var radtheta = (Math.PI * theta) / 180
			var dist =
				Math.sin(radlat1) * Math.sin(radlat2) +
				Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
			dist = Math.acos(dist)
			dist = (dist * 180) / Math.PI
			dist = dist * 60 * 1.1515
			if (unit == 'M') {
				dist = dist * 1.609344 * 1000
			}
			if (unit == 'N') {
				dist = dist * 0.8684
			}
			return dist
		},
		next() {
			this.$store.dispatch('activities/nextPage')
		},
		locationfound(e) {
			this.position = [e.coords.latitude, e.coords.longitude]
			let dist = this.distance(
				this.position[0],
				this.position[1],
				this.poi.latitude,
				this.poi.longitude,
				'M'
			)
			if (dist <= this.poi.map.areaRadius) {
				this.reached = true
				this.$ons.notification.alert('Vous avez atteint la destination', {
					title: 'Destination atteinte'
				})
			}
			this.dist = Math.ceil(dist)
		}
	}
}
</script>

<style>
.pulse {
	margin: auto;
	height: 70px;
	width: 70px;
	border: 15px solid #6f3826;
	border-radius: 70px;
	animation: pulse 0.5s ease-out infinite;
	opacity: 0;
}
@keyframes pulse {
	0% {
		transform: scale(0.1, 0.1);
		opacity: 0;
	}
	50% {
		opacity: 1;
	}
	100% {
		transform: scale(1.1, 1.1);
		opacity: 0;
	}
}
ons-card {
	cursor: pointer;
	color: #333;
}

.card__title,
.card--material__title {
	font-size: 20px;
}
</style>
