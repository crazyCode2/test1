<!-- 加载更多 -->
<template>
  <div>
    <!-- 标题栏 -->
    <mt-header title="加载更多">
      <router-link to="/" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <!-- 列表 -->
    <div class="cont">
      <m-scroller :on-refresh="onRefresh" :on-infinite="onInfinite" :dataList="scrollData" :marginTop="marginTop">
        <ul>
          <li v-for="(item,index) in listData">
            <!-- 左滑删除 -->
            <!-- <m-left-slider @msg-from-child="getMsgFromChild(item)">
              {{item.title}}
            </m-left-slider> -->
            {{item.title}}
          </li>
        </ul>
      </m-scroller>
    </div>
  </div>
</template>

<script>
  import mScroller from '../../components/Scroller'
  import mLeftSlider from '../../components/LeftSlider'

  export default {
    components: {
      mScroller,
      mLeftSlider,
    },
    data() {
      return {
        marginTop:'margin-top:40px;',
        listPage: 1, // 页码
        listData: [], // 数据列表
        scrollData:{
          noFlag: false // 是否显示'暂无数据' false:不显示 true:显示
        },
        canLoadMore: false
      }
    },
    mounted: function() {
      // 首次请求数据
      this.fetchData();
    },
    methods: {
      fetchData() {
        this.listPage = 1;
        // 请求数据
        this.$api.get('category/1004.json',{page: 1},res => {
          this.listData = res.data.books;
        })
      },
      // 下拉刷新
      onRefresh(done) {
        this.fetchData();
        done(); // call done
      },
      // 上拉加载更多
      onInfinite(done) {
        this.listPage++;
        // 加载条
        let more = this.$el.querySelector('.load-more');
        // 判断是否显示加载条
        if(!this.canLoadMore){
          this.axios.get('category/1004.json',{
            params:{
              page: this.listPage
            }
          }).then((response) => {
            this.listData = this.listData.concat(response.data.data.books);
            // 判断是否有下一页
            if(this.listPage >= 3){
              // 没有更多数据
              this.scrollData.noFlag = true;
              this.canLoadMore = true;
            }
          }).catch((err) => {
            //
          })
        }

        // 注: this.scrollData.noFlag 在子组件运行结束后会改为 false
        // if(this.listPage >= 3){ // 判断标准 例如: this.pageStart > this.pageEnd
        //   this.scrollData.noFlag = true;
        // }else{
        //   this.axios.get('category/1004.json',{
        //     params:{
        //       page: this.listPage
        //     }
        //   }).then((response) => {
        //     this.listData = this.listData.concat(response.data.data.books);
        //   }).catch((err) => {
        //     //
        //   })
        // }

        // 隐藏加载条
        more.style.display = 'none';
        done();
      },
      // 左滑删除
      getMsgFromChild (v) {
        this.listData.splice(v,1)
      }
    }
  }
</script>

<style lang="less" scoped>
  ul {
    li {
      min-height: 50px;
      line-height: 50px;
      text-align: center;
      border: 1px solid red;
    }
  }
  // 隐藏滚动条
  ::-webkit-scrollbar{
    display:none;
  }
</style>
