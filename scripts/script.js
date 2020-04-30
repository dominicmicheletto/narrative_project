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

    const advance_step = function() {
      let me = $(this);
      let link = me.attr('id');

      disable_tabs(link);
      increment_progressbar();
    };
    $("a.advance").button().on("click", advance_step);

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

    const arena = $("#arena");
    const step = function() {
      let me = $("input[type=hidden]#step");
      return +me.attr("value");
    };
    const next_step = function() {
      let me = $("input[type=hidden]#step");
      let value = +me.attr("value");

      me.attr("value", ++value);

      handle_step();
    };
    const handle_step = function() {
      arena.empty();

      let text_description, src, alt, button_text;
      let input_needed = null;
      let special_operation = null;
      let at_end = false;

      switch (step()) {
        case 0: { // at start
          text_description = "To get started, you must first <strong>Create An Empty Package</strong> in Sims 4 Studio.";
          src = "create_empty_package";
          alt = "Create an empty package in S4S";
          button_text = "Create Empty Package";

          break;
        }
        case 1:  { // make empty file -- need to name
          text_description = "Give the package file a name.";
          src = "name_package_file";
          alt = "Name the package file";
          button_text = "Save"

          input_needed = {
            description: "Filename",
            field: $("<input>", {
              type: "text",
              value: "",
              id: "filename"
            }),
            validator: function(me) {
              return me.val() === "leroidetout_vicious_vampires";
            }
          };

          break;
        }
        case 2: { // new and empty package file
          text_description = "Now you have a new, empty package file. Time to get started with extracting tuning!";
          src = "new_and_empty_package_file";
          alt = "Empty package file";
          button_text = "Start extracting tuning";

          break;
        }
        case 3: { // wait for tuning to be extracted
          text_description = "Processing combined tuning...";
          src = "processing_combined_tuning";
          alt = "Processing combind tuning";
          button_text = "Continue";

          special_operation = {
            max_value: 25
          };

          break;
        }
        case 4: { // search for vampire tuning
          text_description = "Search for the tuning file needed.";
          src = "extract_tuning";
          alt = "Extract the proper tuning";
          button_text = "Add to current package"

          input_needed = {
            description: "Tuning name",
            field: $("<input>", {
              type: "text",
              value: "",
              id: "tuning_name"
            }),
            validator: function(me) {
              return me.val() === "vampire_DrinkDeeply";
            }
          };

          break;
        }
        case 5:  { // tuning extracted
          text_description = "You've now extracted your tuning and can begin modding!";
          src = "drink_deeply_extracted";
          alt = "Extracted tuning file";
          button_text = "Start Modding"

          at_end = true;

          break;
        }
      }

      let description = $("<p>", {
        html: text_description
      });
      let image = $("<img>", {
        src: `./media/modding/${src}.png`,
        alt: alt,
        height: 500
      });
      let button = $("<a>", {
        text: button_text
      }).button().on("click", next_step);

      arena.append(description);
      $("<p>").append(image).appendTo(arena);

      if (input_needed) {
        input_needed.field.on("change", function() {
          let me = $(this);
          if (input_needed.validator(me))
            $("<p>").append(button).appendTo(arena);
        });
        $("<p>").append($("<label>", {
          for: input_needed.field.attr("id"),
          text: `${input_needed.description}: `
        })).append(input_needed.field).appendTo(arena);
      }
      else if (special_operation) {
        let waiting_bar = $("<div>").progressbar({
          value: false,
          max: special_operation.max_value,
          complete: function() {
            $("<p>").append(button).appendTo(arena);
            clearTimeout(progressTimer);
          }
        });
        const progress_value = function() {
          let val = waiting_bar.progressbar( "value" ) || 0;

          if ( val <= special_operation.max_value ) {
            progressTimer = setTimeout( progress_value, 50 );
          }

          waiting_bar.progressbar( "value", val + Math.floor( Math.random() * 3 ) );
        };
        let progressTimer = setTimeout(progress_value, 1000);
        waiting_bar.appendTo(arena);
      }
      else {
        $("<p>").append(button).appendTo(arena);
      }

      if (at_end) {
        button.addClass("advance").attr("id", 6);
        button.on("click", advance_step);
      }
    };
    handle_step();
  });

})();
