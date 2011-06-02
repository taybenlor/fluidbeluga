class window.Notifier
  constructor: ->
    @count = 0
    $(window).focus(@clearCount)
    @last = {text:""}
  
  newMessage: (data) ->
    if not window.hasFocus and @last.text != data.text
      @last = new Notification(data.uid, "#{data.first} #{data.last}", data.text)
      @count += 1
      window.fluid.dockBadge = "#{@count}"

  clearCount: =>
    @count = 0
    window.fluid.dockBadge = ""
    
class window.Notification
  constructor: (@uid, @name, @text) ->
    @user = p_users["u" + @uid]
    @avatar = "http://belugapods.com/userimg/100/#{@uid}/#{@user.ihash}"
    window.fluid.showGrowlNotification({
        title: "#{@name} said", 
        description: @text,
        icon: @avatar,
        onclick: @focusWindow
    });
    
  focusWindow: =>
    window.fluid.activate()
    
window.notifier = new Notifier()