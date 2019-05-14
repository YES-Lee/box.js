let lock = false

$ui.render({
  props: {
    title: "飞行日志"
  },
  views: [
    {
      type: 'label',
      props: {
        id: 'text',
        text: '手机状态正常'
      },
      layout (make, view) {
        make.centerX.equalTo(view.super)
        make.top.inset(30)
      },
      events: {
        ready () {
          $motion.startUpdates({
            interval: 0.1,
            handler (resp) {
              const { acceleration } = resp
              const { x, y, z } = acceleration
              if (!lock && Math.abs(x + y + z) > 1.5) {
                lock = true
                $('text').text = '手机起飞啦～～～'
                $('reset_btn').hidden = false
                $audio.play({
                  id: 1303
                })
                $device.taptic(2)
              }
            }
          })
        }
      }
    },
    {
      type: 'button',
      props: {
        id: 'reset_btn',
        title: '重置',
        hidden: true
      },
      layout (make, view) {
        make.centerX.equalTo(view.super)
        make.top.equalTo($('text').bottom).offset(10)
        make.width.equalTo(60)
      },
      events: {
        tapped () {
          $('text').text = '手机状态正常'
          lock = false
          $('reset_btn').hidden = true
        }
      }
    }
  ]
});

