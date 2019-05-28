<template>
  <v-ons-page>
    <v-ons-list>
      <v-ons-list-header>Les jeux</v-ons-list-header>
      <v-ons-list-item
        @click="startActivity(activity)"
        v-for="(activity, index) in activityList"
        :key="index"
      >
        <div class="left">
          <v-ons-icon icon="fa-gamepad" class="list-item__icon"></v-ons-icon>
        </div>
        <div class="center">
          <span class="list-item__title">{{activity.label}}</span>
          <span class="list-item__subtitle">{{activity.description}}</span>
          <div class="list-item__subtitle">Difficulté : {{activity.difficulty}}</div>
          <span class="list-item__subtitle">Durée : {{activity.duration}}</span>
        </div>
        <div v-show="activity.score" class="right">Score : {{activity.score}} points</div>
      </v-ons-list-item>
    </v-ons-list>
  </v-ons-page>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {
    activityList() {
      for (let activity of this.$store.state.activities.activities) {
        for (let score of this.userScores) {
          if (activity._id == score.activity) {
            activity.score = score.score
          }
        }
      }
      return this.$store.state.activities.activities
    },
    userScores() {
      return this.$store.state.users.scores
    }
  },
  methods: {
    startActivity(activity) {
      this.$store.commit('activities/setCurrentActivity', activity)
    },
    authenticate() {
      this.$store.dispatch('activities/authenticate')
    },
    push(page, key) {
      this.$store.commit('navigator/push', {
        extends: page,
        data() {
          return {
            toolbarInfo: {
              backLabel: 'Home',
              title: key
            }
          }
        }
      })
    }
  }
}
</script>

<style>
.intro {
  text-align: left;
  padding: 0 22px;
  margin-top: 20px;
  font-size: 14px;
  line-height: 1.4;
  color: rgba(0, 0, 0, 0.54);
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
