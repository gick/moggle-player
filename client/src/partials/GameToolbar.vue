<template>
	<v-ons-page>
		<v-ons-toolbar>
			<div class="center">
				<slot>{{ currentTitle }}</slot>
			</div>
			<div class="left">
				<v-ons-back-button
					v-if="currentPage > 0"
					@click.prevent="back"
				></v-ons-back-button>
			</div>

			<div class="right">
				<v-ons-toolbar-button id="info-button" @click="showPopover($event)">
					<v-ons-icon icon="md-more-vert"></v-ons-icon>
					<Badge :value="badgeValue"></Badge>
				</v-ons-toolbar-button>
			</div>
			<v-ons-popover
				v-if="popoverVisible"
				cancelable
				direction="down"
				:target="event"
				:visible.sync="popoverVisible"
			>
				<v-ons-list>
					<v-ons-list-item
						tappable
						v-for="(page, index) in pages"
						@click="setPage(page.page)"
						:key="index"
						:modifier="md ? 'nodivider' : 'longdivider'"
					>
						<div class="center">{{ page.label }}</div>
						<div class="right" v-if="page.label == 'Inventaire'">
							<Badge style="top:15px" :value="badgeValue"></Badge>
						</div>
					</v-ons-list-item>
				</v-ons-list>
			</v-ons-popover>
		</v-ons-toolbar>
		<v-ons-tabbar
			hide-tabs
			position="bottom"
			:tab-border="false"
			:tabs="allPages"
			:index="currentPage"
		></v-ons-tabbar>
	</v-ons-page>
</template>
<style></style>

<script>
import Score from '../pages/Score.vue'
import Inventory from '../pages/Inventory.vue'
import Badge from '../components/Badge.vue'
export default {
	props: ['title'],
	computed: {
		currentPage() {
			return this.$store.state.activities.currentPage
		},
		allPages() {
			return this.$store.state.activities.pages
		},
		badgeValue() {
			return this.$store.state.users.inventory
		},
		currentTitle() {
			return this.allPages[this.currentPage].title
		}
	},
	data() {
		return {
			event: null,
			index: 0,
			isBack: false,
			popoverVisible: false,
			pages: [
				{ label: 'Score', page: Score },
				{ label: 'Inventaire', page: Inventory },
				{ label: 'Quitter le jeu', page: null }
			]
		}
	},
	components: { Badge },
	methods: {
		back() {
			this.$store.commit('activities/previousPage')
		},
		showPopover($event) {
			this.event = $event
			this.popoverVisible = true
		},
		setPage(page) {
			this.popoverVisible = false
			if (page == null) {
				this.$store.dispatch('activities/quitGame')
				this.$store.commit('navigator/pop')
				return
			}
			this.$store.commit('navigator/push', {
				extends: page
			})
		}
	}
}
</script>
