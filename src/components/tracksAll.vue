<template>
  <div>
    <div class="text-right q-mt-xl q-mr-lg q-mb-md" :style="{'margin-top':this.store.mobileActive ? '20%' : '3%'}">
      <q-btn
        glossy push
        :label="this.store.filterResultActive ? 'Clear' : 'Filter'"
        :icon-right="this.store.filterResultActive ? 'clear_all' : 'filter_list'"
        v-on:click="this.store.filterResultActive ? this.clearFilter() : this.filterActiveButton()"></q-btn>
    </div>
    <q-scroll-area style="height:600px;">
      <q-card
    bordered
    :class="data.type === 'Income' ? 'bg-green-2 ' : 'bg-red-2'"
    :style="{'width':this.store.mobileActive ? '90%' : '500px'}" style="border-radius:10px;margin:10px auto;"
    v-for="data in this.store.allTracks" :key="data.id" class="text-capitalize">
    <q-card-section horizontal>
      <q-card-section class="col-9">
        <div class="text-subtitle2 text-grey-9">
          Type : {{ data.type }}, {{ data.amount }} {{ data.currency }}, Explanation : {{ data.detail }}
        </div>
        <div class="text-caption text-weight-bold text-grey-6">
          {{ data.fullDate }}
        </div>
      </q-card-section>
      <q-card-section class="col-3 text-right" >
        <q-btn icon="edit" style="display:block;" flat color="grey-7" v-on:click="updateTrack(data)"></q-btn>
        <q-btn icon="delete_forever" style="display:block;" flat color="grey-7" v-on:click="deleteTrack(data)"></q-btn>
      </q-card-section>
    </q-card-section>
  </q-card>
    </q-scroll-area>
  </div>
</template>

<script>
import {db} from '../firebase/index'
import { getDatabase, ref, set, remove, update, onValue, query, orderByChild } from "firebase/database";
import {useCounterStore} from '../stores/store'
export default {
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{

    }
  },
  methods:{
    clearFilter(){
      this.store.filterResultActive = false
      this.store.allTracks = this.store.pureListTracks
    },
    filterActiveButton(){
      this.store.filterActive = true
    },
    updateTrack(data){
      this.store.updateData = data
      this.store.updateActive = true
    },
    deleteTrack(data){
      const db = getDatabase()
      remove(ref(db,`tracks/${data.id}`))
      this.store.allTracks = this.store.allTracks.filter(object => object.id !== data.id)
    },
    getTracks(){
      const db = getDatabase()
      const dbRef = query(ref(db,`tracks/`),orderByChild('date','asc'))
      onValue(dbRef,(snapshot) => {
        const list = []
        snapshot.forEach((childSnapshot) => {
          list.push(childSnapshot.val())
        })
        this.store.allTracks = list
        this.store.pureListTracks = list
        console.log('allTracks',this.store.allTracks)
      })
    }
  },
  created(){
    this.getTracks()
  },
  mounted(){

  },
  watch:{

  }
}
</script>

<style scoped>

</style>
