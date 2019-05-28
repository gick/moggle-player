<template>
	<p style="text-align:center">
		{{ item.badgeText }}
		<vue-simple-markdown
			v-if="item.media"
			:source="item.media.mkdown"
		></vue-simple-markdown>
	</p>
</template>

<script>
export default {
	data() {
		return {}
	},
	props: ['item']
}
</script>
