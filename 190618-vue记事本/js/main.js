;(function() {
  'use strict';
  var Event = new Vue();
  
  var alert_sound = document.getElementById('alert-sound');
  function copy(obj) {
    return Object.assign({}, obj);
  }
  Vue.component('task', {
    template: '#task-tpl',
    props: ['todo'],
    methods: {
      action: function (name, params) {
        Event.$emit(name, params);
      },
    },
  }),
  new Vue({
    el: '#main',
    data: {
      list: [],
      last_id: 0,
      current: {},
    },

    mounted: function () {
      var me = this;
      this.list = ms.get('list') || this.list;
      this.last_id = ms.get('last_id') || this.last_id;

      // this.check_alerts();
      // 每隔一秒检查一次
      setInterval(function () {
        me.check_alerts();
      }, 1000);
      Event.$on('remove', function(id) {
        // console.log(id);
        if(id) {
          me.remove(id);
        };
      });
      Event.$on('toggle_complete', function(id) {
        // console.log(id);
        if(id) {
          me.toggle_complete(id);
        };
      });
      Event.$on('set_current', function(id) {
        // console.log(id);
        if(id) {
          me.set_current(id);
        };
      });
      Event.$on('toggle_detail', function(id) {
        // console.log(id);
        if(id) {
          me.toggle_detail(id);
        };
      });
    },
    methods: {
      check_alerts: function () {
        var me = this;
        this.list.forEach(function (row, i) {
          var alert_at = row.alert_at;
          if (!alert_at || row.alert_confirmed) return;
          // console.log(alert_at);
          var alert_at = (new Date(alert_at)).getTime();
          var now = new Date().getTime();
          // var timestamp = alert_at.getTime();
          // console.log(timestamp);
          if (now >= alert_at) {
            alert_sound.play();
            var confirmed = confirm(row.title);
            Vue.set(me.list[i], 'alert_confirmed', confirmed);
          }
        });
      },
      merge: function() {
        var title = this.current.title;
        //如果为0则为false，那么逻辑非就会返回true,所以必须加上限制
        var is_update, id;
        is_update = id = this.current.id;
        if(is_update) {
          var index = this.find_index(id);
          Vue.set(this.list, index, copy(this.current));
          // this.list[index] = copy(this.current);
          // console.log(this.list);
        } else {
          if(!title && title !==0) return;
          var todo = copy(this.current);
          this.last_id++;
          todo.id = this.last_id;
          ms.set('last_id', this.last_id);
          this.list.push(todo);
        };
        // ms.set('list', this.list);
        this.reset_current();
      },

      toggle_detail: function (id) {
        var index = this.find_index(id);
        this.list[index].show_detail;
        Vue.set(this.list[index], 'show_detail',!this.list[index].show_detail);
      },
      remove: function(id) {
        var index = this.find_index(id);
        this.list.splice(index, 1);
        // ms.set('list', this.list);
      },
      // next_id: function () {
      //   return this.list.length + 1;
      // },
      set_current: function (todo) {
        this.current = copy(todo);
      },

      reset_current: function () {
        this.set_current({});
      },

      find_index: function(id) {
        return this.list.findIndex(function(item) {
          return item.id == id;
        });
      },

      toggle_complete: function(id) {
        var i = this.find_index(id);
        Vue.set(this.list[i], 'completed', !this.list[i].completed);
        // this.list[i].complete = !this.list[i].complete;
      },
    },
    watch: {
      list: {
        deep: true,
        handler: function(n, o) {
          if (n) {
            ms.set('list', n);
          } else {
            ms.set('list', []);
          }
        }
      }
    },
  });
})();