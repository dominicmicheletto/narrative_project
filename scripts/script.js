(function() {

  $(document).ready(function() {
    const tabs = $("#tabs").tabs();
    const calculate_value = function() {
      let value = progress.progressbar("value");
      let max = progress.progressbar("option", "max");
      let percent = ((value / max) * 100).toFixed(0);

      $(".progress-label").text(`${percent}% complete`);
    };
    const progress = $("#progress").progressbar({
      value: 1,
      max: $(tabs.find("ul")[0]).children().length - 1,
      change: calculate_value
    });
    const increment_progressbar = function() {
      let value = progress.progressbar("value");
      progress.progressbar("value", ++value);
    };
    calculate_value();

    const disable_tabs = function(tab_to_enable) {
      $("#tabs a.ui-tabs-anchor").addClass("disabled");
      $(`#tabs a[href=${+tab_to_enable}]`).removeClass("disabled");

      $("#tabs a.disabled.ui-tabs-anchor").each(function(index) {
        if (index === tab_to_enable) return;
        tabs.tabs("disable", index);
      });
      
      tabs.tabs("enable", +tab_to_enable);
      tabs.tabs("option", "active", +tab_to_enable);
    };
    disable_tabs(0);

    $("a.advance").button().on("click", function() {
      let me = $(this);
      let link = me.attr('id');

      disable_tabs(link);
      increment_progressbar();
    });

    $("a.popup").on("click", function() {
      let me = $(this);
      let src = `./media/${me.attr('id')}.png`;
      let alt = `${me.attr('id')} image`;

      let image = $("<img>", {
        "alt": alt,
        "src": src
      });
      let dialog = $("<div>", {
        "title": "Feature Preview"
      }).dialog({
        autoOpen: false,
        width: "auto",
        height: "auto",
        show: {
          effect: "blind",
          duration: 1000
        }
      });

      image.appendTo(dialog);
      dialog.dialog("open");
    });
  });

})();
