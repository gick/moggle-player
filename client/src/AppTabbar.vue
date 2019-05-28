<template>
	<v-ons-page :style="swipePosition">
		<custom-toolbar :style="swipeTheme" modifier="white-content">
			{{ title }}
			<v-ons-toolbar-button
				slot="right"
				modifier="white-content"
				@click="$store.commit('splitter/toggle')"
			>
				<v-ons-icon icon="ion-navicon, material:md-menu"></v-ons-icon>
			</v-ons-toolbar-button>
		</custom-toolbar>

		<v-ons-tabbar
			position="auto"
			swipeable
			:modifier="md ? 'autogrow white-content' : ''"
			:on-swipe="md ? onSwipe : null"
			:tabbar-style="swipeTheme"
			:tabs="tabs"
			:index.sync="index"
		></v-ons-tabbar>
	</v-ons-page>
</template>

<script>
import Home from './pages/Home.vue'
import Profil from './pages/Profil.vue'
import Login from './pages/Login.vue'
import axios from 'axios'
import { auth } from './firebase'
// Just a linear interpolation formula
const lerp = (x0, x1, t) => parseInt((1 - t) * x0 + t * x1, 10)
// RGB colors
const red = [244, 67, 54]
const blue = [30, 136, 229]

export default {
	data() {
		return {
			showingTip: false,
			colors: red,
			animationOptions: {},
			topPosition: 0
		}
	},
	mounted() {
		auth.onAuthStateChanged(
			function(user) {
				if (user) {
					this.$store.commit('users/setUser', user)
					this.$store.dispatch('users/getUsersData').then(
						function() {
							axios.get('api/listActivities').then(
								function(response) {
									this.$store.commit('activities/set', response.data)
								}.bind(this)
							)
						}.bind(this)
					)
					// User is signed in.
				} else {
					this.$store.commit('users/logout')
					// No user is signed in.
				}
			}.bind(this)
		)
	},
	methods: {
		onSwipe(index, animationOptions) {
			// Apply the same transition as ons-tabbar
			this.animationOptions = animationOptions

			// Interpolate colors and top position
			const a = Math.floor(index),
				b = Math.ceil(index),
				ratio = index % 1
			this.colors = this.colors.map((c, i) =>
				lerp(this.tabs[a].theme[i], this.tabs[b].theme[i], ratio)
			)
			this.topPosition = lerp(
				this.tabs[a].top || 0,
				this.tabs[b].top || 0,
				ratio
			)
		}
	},

	computed: {
		badge() {
			return this.$store.state.users.profilBadge
		},
		tabs() {
			return [
				{
					label: 'Login',
					icon: 'ion-home',
					page: Login,
					theme: red
				},
				{
					label: 'Jeux',
					icon: 'md-puzzle-piece',
					page: Home,
					theme: red
				},
				{
					label: 'Profil',
					icon: 'md-face',
					page: Profil,
					theme: blue,
					badge: this.badge ? this.badge : null
				}
			]
		},
		index: {
			get() {
				return this.$store.state.tabbar.index
			},
			set(newValue) {
				this.$store.commit('tabbar/set', newValue)
			}
		},
		title() {
			return this.md
				? 'MOGGLE'
				: this.tabs[this.index].title || this.tabs[this.index].label
		},
		swipeTheme() {
			return (
				this.md && {
					backgroundColor: `rgb(${this.colors.join(',')})`,
					transition: `all ${this.animationOptions.duration || 0}s ${this
						.animationOptions.timing || ''}`
				}
			)
		},
		swipePosition() {
			return (
				this.md && {
					top: this.topPosition + 'px',
					transition: `all ${this.animationOptions.duration || 0}s ${this
						.animationOptions.timing || ''}`
				}
			)
		}
	}
}
</script>

<style>
/* Custom 'white-content' modifier */

.page--material .toolbar--white-content__center,
.page--material .toolbar-button--white-content,
.page--material :checked + .tabbar--white-content__button {
	color: white;
}

.page--material .tabbar--white-content__button {
	color: rgba(255, 255, 255, 0.7);
}

.page--material .tabbar--white-content__border {
	background-color: white;
}
</style>
