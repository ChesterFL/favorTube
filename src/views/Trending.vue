<template>
  <div id="trending" class="pt-7 px-sm-10">
    <v-container fluid>
      <v-row>
        <v-col
            cols="6"
            sm="8"
            md="10"
            lg="10"
            v-for="(video, i) in loading ? 12 : videos"
            :key="i"
            class="mx-lg-0 mx-md-0 mx-sm-auto mx-auto trend-wrap"
        >
          <v-skeleton-loader
              class="mx-auto"
              type="list-item-avatar-three-line"
              :loading="loading"
              tile
              large
          >
            <v-card class="card" tile flat :to="`/watch/${video._id}`">
              <v-row no-gutters class="trending-card-item">
                <v-col class="mx-auto" cols="11" sm="8" md="5" lg="4">
                  <!-- <v-responsive max-height="100%"> -->
                  <v-img
                      max-height="200"
                      class="align-center"
                      :src="`${getImgUrl}/uploads/thumbnails/${video.thumbnailUrl}`"
                  >
                  </v-img>
                  <!-- </v-responsive> -->
                </v-col>
                <!-- hidden-sm-and-down -->
                <v-col class="mx-auto" cols="12" sm="9" md="6" lg="8">
                  <div class="trend-total">
                    <v-card-title class="pl-2 pt-0 subtitle-1 font-weight-bold text-ellipsis trend-title">
                      {{ video.title }}
                    </v-card-title>

                    <v-card-subtitle class="pl-2 pb-0 text-ellipsis-center trend-channel-views-date" v-if="video.userId">
                      {{ video.userId.channelName }}
                      <v-icon>mdi-circle-small</v-icon
                      >{{ video.views }} views<v-icon>mdi-circle-small</v-icon
                    >{{ dateFormatter(video.createdAt) }}
                    </v-card-subtitle>
                    <v-card-subtitle class="pl-2 pt-0 text-ellipsis trend-desc">
                      {{ truncateText(video.description, 200) }}
                    </v-card-subtitle>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-skeleton-loader>
        </v-col>
        <v-col class="text-center" v-if="videos.length === 0 && !loading">
          <p>No trending videos yet</p>
        </v-col>
        <v-col cols="12" sm="12" md="12" lg="12">
          <infinite-loading @infinite="getVideos">
            <div slot="spinner">
              <v-progress-circular
                  indeterminate
                  color="red"
              ></v-progress-circular>
            </div>
            <div slot="no-results"></div>
            <span slot="no-more"></span>
            <div slot="error" slot-scope="{ trigger }">
              <v-alert prominent type="error">
                <v-row align="center">
                  <v-col class="grow">
                    <div class="title">Error!</div>
                    <div>
                      Something went wrong, but don’t fret — let’s give it
                      another shot.
                    </div>
                  </v-col>
                  <v-col class="shrink">
                    <v-btn @click="trigger">Take action</v-btn>
                  </v-col>
                </v-row>
              </v-alert>
            </div>
          </infinite-loading>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import moment from 'moment'

import { mapGetters } from 'vuex'

import VideoService from '@/services/VideoService'

export default {
  name: 'Trending',
  data: () => ({
    loading: false,
    loaded: false,
    errored: false,
    videos: [],
    page: 1
  }),
  computed: {
    ...mapGetters(['currentUser', 'getUrl', 'isAuthenticated',"getImgUrl"])
  },
  methods: {
    async getVideos($state) {
      if (!this.loaded) {
        this.loading = true
      }

      const videos = await VideoService.getAll('public', {
        page: this.page,
        sort: '-views'
      })
          .catch((err) => {
            console.log(err)
            this.errored = true
          })
          .finally(() => {
            this.loading = false
          })

      if (typeof videos === 'undefined') return

      if (videos.data.data.length) {
        this.page += 1
        this.videos.push(...videos.data.data)
        $state.loaded()
        this.loaded = true
      } else {
        $state.complete()
      }
    },
    truncateText(string = '', num) {
      if (string.length <= num) {
        return string
      }
      return string.slice(0, num)
    },
    dateFormatter(date) {
      return moment(date).fromNow()
    }
  },
  components: {
    InfiniteLoading
  }
}
</script>

<style lang="scss">
.trend-total {
  margin-left: 16px;
}

.v-skeleton-loader__list-item-avatar-three-line {
  height: 250px;
  .v-skeleton-loader__paragraph.v-skeleton-loader__bone {
    margin-top: -125px;
    @media (max-width: 700px) {
      display: none;
      margin-top: inherit;
    }
  }
  .v-skeleton-loader__avatar {
    height: 200px !important;
    width: 300px !important;
  }
  .v-skeleton-loader__text {
    height: 20px;
  }
}

@media screen and (max-width: 920px) {
  .text-ellipsis {
    display:-webkit-box;
    text-overflow: ellipsis;
    -webkit-box-orient:vertical; 
    overflow: hidden;
    -webkit-line-clamp: 1;
    padding: 0;
    margin-top: 12px;
  }

  .text-ellipsis-center {
    margin-top: 0px!important;
  }
}

@media screen and (max-width: 600px) {
  .trend-total {
    margin-left: 0;
  }

  .trend-title {
    font-size: 12px!important;
  }

  .trend-channel-views-date {
    display: -webkit-box !important;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    >i {
      font-size: 10px!important;
    }
  }

  .trend-desc,
  .trend-channel-views-date {
    font-size: 10px!important;
  }
}
</style>

<style lang="scss" scoped>
@media screen and (max-width: 600px) {
  .trend-wrap:nth-child(2n + 1) {
    padding-right: 6px!important;
  }
  .trend-wrap:nth-child(2n) {
    padding-left: 6px!important;
  }
}
</style>
