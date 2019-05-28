<template>
	<v-ons-page>
		<custom-toolbar title="Score" backLabel></custom-toolbar>
		<v-ons-card> Score : {{ $store.state.activities.score }} </v-ons-card>
	</v-ons-page>
</template>

<script>
export default {
	data() {
		return {}
	},
	computed: {},
	mounted() {},
	methods: {}
}
</script>

<style></style>
