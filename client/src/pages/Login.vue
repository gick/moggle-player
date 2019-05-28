<template>
  <v-ons-page >
    <div v-show="uid.length==0">
    <v-ons-list>
      <v-ons-list-item :modifier="md ? 'nodivider' : ''">
        <div class="left">
          <v-ons-icon icon="md-face" class="list-item__icon"></v-ons-icon>
        </div>
        <label class="center">
          <v-ons-input style="width:100%" float placeholder="Email" v-model="email"></v-ons-input>
        </label>
      </v-ons-list-item>
      <v-ons-list-item :modifier="md ? 'nodivider' : ''">
        <div class="left">
          <v-ons-icon icon="fa-key" class="list-item__icon"></v-ons-icon>
        </div>
        <label class="center">
          <v-ons-input type="password" float maxlength="20" placeholder v-model="password"></v-ons-input>
        </label>
      </v-ons-list-item>
    </v-ons-list>
    <p style="text-align: center">
      <v-ons-button @click="login">Login</v-ons-button>
      <v-ons-button @click="signup">Nouveau compte</v-ons-button>
    </p>
    </div>
    <div v-show="uid.length>0">
      <v-ons-card>
        <div class="title">Bienvenue dans Moggle</div>
        <div class="content">
          Vous pouvez accéder aux jeux et à votre profil en Swippant
        </div>
        <p style="text-align:center">
        <v-ons-button @click="logout">Se déconnecter</v-ons-button>
        </p>
      </v-ons-card>
    </div>
  </v-ons-page>
</template>
<script>
import Signup from "./Signup.vue";
import { auth } from "../firebase";

export default {
  data() {
    return {
      email: "",
      password: ""
    };
  },
  computed: {
    uid() {
      return this.$store.state.users.id;
    }
  },

  methods: {
    login() {
      auth.signInWithEmailAndPassword(this.email, this.password).catch(
        function(error) {
          this.$ons.notification.alert("Email ou mot de passe incorrect");
        }.bind(this)
      );
    },
    logout(){
      auth.signOut()
    },
    signup() {
      this.$store.commit("navigator/push", {
        extends: Signup,
        data() {
          return {
            toolbarInfo: {
              backLabel: "Home",
              title: "Nouveau compte"
            }
          };
        }
      });
    },
    next() {
      this.$store.commit("activities/endGame");
      this.$store.commit("navigator/pop");
    }
  }
};
</script>
