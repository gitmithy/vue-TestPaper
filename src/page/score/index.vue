<template>

  <div>
<div class="swj_form swj_intro">
          <div class="swj_intro_title"></div>
        <div class="swj_intro_jx"></div>
        <div class="swj_intro_city swj_score_city"></div>
        <div class="swj_score_panel"></div>
        <div class="swj_score_scorenum">
          {{ score }}
        </div>
        <div class="swj_score_scoretips" >
          <!-- {{ scoreTips }} -->
          <img src="../../images/isa.png" v-show="IsA"  class="class-a" />
          <img src="../../images/isb.png" v-show="IsB"  class="class-b" />
          <img src="../../images/isc.png" v-show="IsC"  class="class-c" />
        </div>
</div>





  </div>

</template>

<script>
import { mapState } from "vuex";
export default {
  name: "score",
  data() {
    return {
      showHide: false, //是否显示提示
      score: null, //分数
      scoreTips: "", //分数提示
      rightAnswer: [1, 8, 9, 16, 17,24,28,29,34,37,41,48,52,54,60,62,65,72,73,78], //正确答案
      scoreTipsArr: [
        "还要继续加油哦",
        "棒棒哒",
        "你太优秀了"
      ],
      IsA:false,
      IsB:false,
      IsC:false
    };
  },
  computed: mapState(["answerid"]),
  created() {
    console.log(this.answerid);
     window.scrollTo(0,0);
    if (this.answerid.length === 0) {
      this.$router.push("/");
    } else {
      this.computedScore();
      this.getScoreTip();
    }

    // document.body.style.backgroundImage = "url(./static/img/4-1.jpg)";
  },
  methods: {
    //计算分数
    computedScore() {
      this.answerid.forEach((item, index) => {
        if (item == this.rightAnswer[index]) {
          this.score += 5;
        }
      });
    },
    //是否显示分享提示
    showCover: function() {
      this.showHide = !this.showHide;
    },
    //根据分数显示提示
    getScoreTip: function() {
      let index = Math.ceil(this.score / 20) - 1;
      this.scoreTips = this.scoreTipsArr[index];
      if(this.score<=60){
        this.scoreTips = this.scoreTipsArr[0];
        this.IsC=true;
      }
      if(this.score>60&&this.score<80){
        this.scoreTips = this.scoreTipsArr[1];
        this.IsB=true;
      }
      if(this.score>=80){
        this.scoreTips = this.scoreTipsArr[2];
        this.IsA=true;
      }
    }
    // AxiosTest:function(){
    //   console.log(this.score)
    // }
  }
};
</script>

<style lang="less">
body {
  // background-image: url(../../images/4-1.jpg);
  // padding-top: 1.2rem;
}
.your_scores_container {
  width: 9.7rem;
  height: 9.1rem;
  background: url(../../images/4-2.png) no-repeat;
  background-size: 100% 100%;
  margin: 0 auto 0;
  position: relative;
  .your_scores {
    position: absolute;
    width: 100%;
    text-indent: 3.3rem;
    top: 4.7rem;
    font-size: 1.4rem;
    font-weight: 900;
    -webkit-text-stroke: 0.05rem #412318;
    font-family: "Microsoft YaHei";
    .score_num {
      font-family: Tahoma, Helvetica, Arial;
      color: #a51d31;
    }
    .fenshu {
      color: #a51d31;
    }
  }
  .result_tip {
    position: absolute;
    top: 7rem;
    width: 9rem;
    left: 0.6rem;
    color: #3e2415;
    font-size: 0.65rem;
    text-align: center;
  }
}
.share_button {
  width: 6.025rem;
  height: 2.4rem;
  margin: 0.8rem auto 0;
  background: url(../../images/4-3.png) no-repeat 0.4rem 0;
  background-size: 5.825rem 100%;
}
.share_code {
  width: 5.3rem;
  margin: 1.5rem auto 0;
  .share_header {
    color: #664718;
    font-size: 0.475rem;
    font-family: "Microsoft YaHei";
    width: 7rem;
    font-weight: 500;
  }
  .code_img {
    height: 5.3rem;
    width: 5.3rem;
    margin-top: 0.5rem;
  }
}
.share_cover {
  position: fixed;
  bottom: 0;
  right: 0;
  top: 0;
  left: 0;
  background: url(../../images/5-1.png) no-repeat;
  background-size: 100% 100%;
  opacity: 0.92;
}
.share_img {
  height: 10.975rem;
  width: 11.95rem;
  position: fixed;
  top: 0.5rem;
  left: 50%;
  margin-left: -5.975rem;
}
</style>
