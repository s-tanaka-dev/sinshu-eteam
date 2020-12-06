var microBitBle;

//リレーサービスインスタンスを取得する
var relay = RelayServer("achex", "chirimenSocket");

new Vue({
  el: "#app",
  data: {
    msg: "---",
    siteName: "3密回避システム",
    updated: null,
    getValues: {
      // 温度
      stTemp: 0,

      // 座っている人
      stSitting: 0,

      // 湿度
      stHumidity: 0,

      // 家電制御
      doWake: 0,
      stPower: 0,

      // 自動換気
      doOpen: 0,
      stWindow: 0,

      // 危険度
      dangerLevel: 3,

      //メッセージ
      message: "最適な状態です。"
    },
    week: ["日", "月", "火", "水", "木", "金", "土"]
  },
  computed: {},
  methods: {
    init() {
      this.updated = this.getUpdated();
    },

    connect: async function () {
      microBitBle = await microBitBleFactory.connect();
      this.msg = "micro:bit BLE接続しました。";

      this.connectRelay();
    },
    disconnect: async function () {
      await microBitBle.disconnect();
      this.msg = "micro:bit BLE接続を切断しました。";
    },

    connectRelay: async function () {
      var self = this;

      var relay = RelayServer("achex", "KandKSocket");
      var channel = await relay.subscribe("KandKSensors");
      console.log(channel.onmessage);

      channel.onmessage = getMessage;

      function getMessage(message) {
        console.log(message.data);
        self.getValues = Object.assign(self.getValues, message.data);
      }
    },

    getUpdated() {
      const getDate = new Date();
      const params = [
        `${getDate.getFullYear()}年`,
        `${getDate.getMonth() + 1}月`,
        `${getDate.getDate()}日`,
        `　${getDate.getHours()}`,
        `:${getDate.getMinutes()}`,
        `:${getDate.getSeconds()}`
      ];

      return params.join("");
    }
  },
  mounted() {
    this.init();
  }
});
