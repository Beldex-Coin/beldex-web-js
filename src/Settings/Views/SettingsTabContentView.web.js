'use strict'

const StackAndModalNavigationView = require('../../StackNavigation/Views/StackAndModalNavigationView.web')

class SettingsTabContentView extends StackAndModalNavigationView {
  setup () {
    super.setup() // we must call on super
    const self = this
    {
      const SettingsView = require('./SettingsView.web')
      const view = new SettingsView({}, self.context)
      self.settingsView = view
    }
    self.SetStackViews(
      [
        self.settingsView
      ]
    )
  }

  //
  //
  // Runtime - Accessors - Implementation of TabBarItem protocol
  // custom tab bar item styling
  TabBarItem_layer_customStyle (isHorizontalBar) {
    if (isHorizontalBar) {
      return false
    } else {
      return 'tabButton-send-location'
    }
  }

  TabBarItem_icon_customStyle () {
    return 'tabButton-settings'
  }

  TabBarItem_icon_selected_customStyle () {
    return 'tabButton-settings-selected'
  }

  // interactivity
  TabBarItem_shallDisable () {
    const self = this
    const passwordController = self.context.passwordController
    if (passwordController.hasUserSavedAPassword !== true) {
      return false // no existing data - do not disable
    }
    if (passwordController.HasUserEnteredValidPasswordYet() !== true) { // has data but not unlocked app
      return true // because the app needs to be unlocked before they can use it
    }
    if (passwordController.IsUserChangingPassword() === true) {
      return true // changing pw - prevent jumping around
    }
    return false
  }
}
module.exports = SettingsTabContentView
