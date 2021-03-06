let settings = (function () {
  let userSettings;

  let environmentSelectId = "settings-env-select";
  let regionSelectId = "settings-region-select";
  let hideColumnsSelectId = "settings-columns-select";
  let gdaxEnvsSelectId = "settings-gdax-env-select";

  let successMsgId = "settings-success-msg";
  let errorMsgId = "settings-error-msg";

  function init() {
    setUserSelections();
  }

  function setUserSelections(ignoreIfSet) {
    // setup settings.html from db user info
  }

  function saveSettings(event) {
    // save changes to user settings on settings.html
    try {
      event.preventDefault();
      let opts = {};
      opts.envs = $("#" + environmentSelectId).val();
      opts.regions = $("#" + regionSelectId).val();
      opts.hiddenColumns = $("#" + hideColumnsSelectId).val();
      opts.gdaxHideEnvs = $("#" + gdaxEnvsSelectId).val();
      let params = {
        authToken: auth.getAuthToken(),
        settings: opts,
      };
      $.ajax({
        url: "/api/user",
        type: "PUT",
        data: params,
      })
        .done(function (data) {
          if (data.error) {
            return errors.handleError(data.error, errorMsgId);
          }
          auth.changeUserSettings({ settings: opts });
          errors.handleSuccess("", successMsgId);
        })
        .fail(function (err) {
          errors.handleError(err, errorMsgId);
        });
    } catch (error) {
      console.log(error);
      errors.handleError(error);
    }
  }

  document.addEventListener("changeUserSettings", function (e) {
    try {
      userSettings = e.detail;
      setUserSelections(true);
    } catch (error) {
      console.log(error);
      errors.handleError(error);
    }
  });

  pages.namespaces.settings = {
    init: init,
    saveSettings: saveSettings,
    setUserSelections: setUserSelections,
  };
  return pages.namespaces.settings;
})();
