import QRCode from './pages/QRCode.vue'
import Map from './pages/Map.vue'
import Radar from './pages/Radar.vue'
import MediaPage from './pages/MediaPage.vue'
import Question from './pages/Question.vue'
import Folia from './pages/Folia.vue'
import axios from 'axios'

export default {
	mutations: {},
	modules: {
		navigator: {
			strict: true,
			namespaced: true,
			state: {
				stack: [],
				options: {}
			},
			mutations: {
				push(state, page) {
					state.stack.push(page)
				},
				pop(state) {
					if (state.stack.length > 1) {
						state.stack.pop()
					}
				},
				replace(state, page) {
					state.stack.pop()
					state.stack.push(page)
				},
				reset(state, page) {
					state.stack = [page || state.stack[0]]
				},
				options(state, newOptions = {}) {
					state.options = newOptions
				}
			}
		},

		splitter: {
			strict: true,
			namespaced: true,
			state: {
				open: false
			},
			mutations: {
				toggle(state, shouldOpen) {
					if (typeof shouldOpen === 'boolean') {
						state.open = shouldOpen
					} else {
						state.open = !state.open
					}
				}
			}
		},
		users: {
			strict: true,
			namespaced: true,
			state: {
				userList: [],
				inventory: 0,
				inventoryItems: [],
				id: '',
				email: '',
				scores: [],
				allBadges: [],
				sessionBadges: [],
				profilBadge: 0
			},
			mutations: {
				setUser(state, payload) {
					state.id = payload.uid
					state.email = payload.email
				},
				setInventoryItem(state, inventoryItem) {
					state.inventoryItems.push(inventoryItem)
					state.inventory++
				},
				resetInventoryBadge(state) {
					state.inventory = 0
				},
				resetProfilBadge(state) {
					state.profilBadge = 0
				},
				resetInventory(state) {
					state.inventoryItems = []
					state.inventory = 0
				},
				setBadge(state, badge) {
					if(badge==null)
						return
					let index = state.allBadges.findIndex(val => val._id == badge._id)
					if (index == -1) {
						state.profilBadge++
						axios.post('/api/badges', { badge: badge, id: state.id })
						// state.allBadges.push(badge)
					}
					state.sessionBadges.push(badge)
				},
				logout(state) {
					state.id = ''
					state.email = ''
				}
			},
			actions: {
				getUsersData({ state }) {
					return axios.get('/api/userData').then(function(response) {
						let user = response.data.find(val => val.userId == state.id)
						if (!user) return
						state.scores = user.score
						for (let badge of user.badge) {
							state.allBadges.push(badge)
						}
					})
				},
				setScore({ state }, data) {
					let index = state.scores.findIndex(
						val => val.activity == data.activityId
					)
					if (index != -1) {
						state.scores.splice(index, 1, {
							activity: data.activityId,
							score: data.score
						})
					} else {
						state.scores.push({
							activity: data.activityId,
							score: data.score
						})
					}
					axios.post('/api/score', {
						id: state.id,
						score: data.score,
						activityId: data.activityId
					})
				}
			}
		},
		activities: {
			strict: true,
			namespaced: true,

			state: {
				activities: [],
				currentActivity: {},
				unitGameIndex: 0,
				pages: [],
				userId: '',
				startActivity: false,
				currentPage: 0,
				score: 0,
				badge: null
			},
			mutations: {
				set(state, activities) {
					state.activities = activities
				},
				addScore(state, point) {
					state.score = state.score + point
				},
				nextPage(state) {
					state.currentPage++
				},
				nextUnitGame(state) {
					state.unitGameIndex++
				},
				previousPage(state) {
					state.currentPage--
				},
				endGame(state) {
					state.startActivity = false
					state.pages = []
					state.currentPage = 0
					state.currentUnitGame = 0
					state.unitGameIndex = 0
					state.score = 0
					state.badge = null
				},
				setCurrentActivity(state, activity) {
					state.currentActivity = activity
					state.pages = []
					if (state.currentActivity.startpage) {
						state.pages.push({
							title: 'Information',
							page: MediaPage,
							props: {
								page: state.currentActivity.startpage
							}
						})
					}

					for (let currentUnitGame of activity.unitgameActivities) {
						let unitGamePages = []
						if (currentUnitGame.startMedia) {
							unitGamePages.push({
								title: 'Information',
								label: 'start',
								page: MediaPage,
								props: {
									page: currentUnitGame.startMedia
								}
							})
						}
						if (currentUnitGame.POI) {
							if (currentUnitGame.poiGuidance == 'qr') {
								unitGamePages.push({
									title: 'Validation QR code',
									label: 'guidance',
									page: QRCode,
									props: {
										qr: {
											id: currentUnitGame.POI._id,
											correct: currentUnitGame.qrCorrect,
											incorrect: currentUnitGame.qrIncorrect
										}
									}
								})
							}
							if (currentUnitGame.poiGuidance == 'radar') {
								unitGamePages.push({
									title: 'Radar',
									label: 'guidance',
									page: Radar,
									props: {
										poi: currentUnitGame.POI
									}
								})
							}

							if (currentUnitGame.poiGuidance == 'map') {
								unitGamePages.push({
									title: 'Carte',
									label: 'guidance',
									page: Map,
									props: {
										poi: currentUnitGame.POI
									}
								})
							}
						}
						if (
							currentUnitGame.mcqActivities.length ||
							currentUnitGame.freetextActivities.length
						) {
							unitGamePages.push({
								title: 'Questions',
								label: 'activities',
								page: Question,
								props: {
									mcq: currentUnitGame.mcqActivities,
									freetext: currentUnitGame.freetextActivities
								}
							})
						}
						if (currentUnitGame.foliaActivities.length) {
							unitGamePages.push({
								title: 'Reconnaissance de feuille',
								page: Folia,
								props: {
									data: currentUnitGame.foliaActivities[0]
								}
							})
						}
						if (currentUnitGame.feedbackMedia) {
							unitGamePages.push({
								title: 'Information',
								page: MediaPage,
								props: {
									page: currentUnitGame.feedbackMedia
								}
							})
						}
						if (
							currentUnitGame.inventoryItem &&
							currentUnitGame.inventoryStep
						) {
							let reversed = unitGamePages.reverse()
							let pageWithInventory = reversed.find(
								val => val.label == currentUnitGame.inventoryStep
							)
							if (pageWithInventory) {
								pageWithInventory.props.inventoryItem =
									currentUnitGame.inventoryItem
							}
							unitGamePages.reverse()
						}
						state.pages = state.pages.concat(unitGamePages)
					}
					if (state.currentActivity.endPage) {
						state.pages.push({
							title: 'Fin du jeu',
							page: MediaPage,
							props: {
								page: state.currentActivity.endPage
							}
						})
					}

					if (state.currentActivity.badge) {
						state.badge = state.currentActivity.badge
					}
					state.currentPage = 0
					state.startActivity = true
				}
			},
			actions: {
				nextPage({ dispatch, commit, state }) {
					if (state.currentPage == state.pages.length - 1) {
						dispatch(
							'users/setScore',
							{
								activityId: state.currentActivity._id,
								score: state.score
							},
							{
								root: true
							}
						)
						if(state.badge)
							dispatch('setBadge')
						commit('endGame')
						commit('users/resetInventory', null, { root: true })
						commit('navigator/reset', null, {
							root: true
						})
					} else {
						commit('nextPage')
					}
				},
				setBadge({ commit, state }) {
					commit('users/setBadge', state.badge, { root: true })
				},
				quitGame({ commit }) {
					commit('endGame')
					commit('users/resetInventory', null, { root: true })
				}
			}
		},
		tabbar: {
			strict: true,
			namespaced: true,
			state: {
				index: 0
			},
			mutations: {
				set(state, index) {
					state.index = index
				}
			}
		}
	}
}
