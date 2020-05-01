(function() {

  $(function() {
    $.widget( "custom.combobox", {
      _create: function() {
        this.wrapper = $( "<span>" )
          .addClass( "custom-combobox" )
          .insertAfter( this.element );

        this.element.hide();
        this._createAutocomplete();
        this._createShowAllButton();
      },

      _createAutocomplete: function() {
        var selected = this.element.children( ":selected" ),
          value = selected.val() ? selected.text() : "";

        this.input = $( "<input>" )
          .appendTo( this.wrapper )
          .val( value )
          .attr( "title", "" )
          .addClass( "custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left" )
          .autocomplete({
            delay: 0,
            minLength: 0,
            source: $.proxy( this, "_source" )
          })
          .tooltip({
            classes: {
              "ui-tooltip": "ui-state-highlight"
            }
          });

        this._on( this.input, {
          autocompleteselect: function( event, ui ) {
            ui.item.option.selected = true;
            this._trigger( "select", event, {
              item: ui.item.option
            });
          },

          autocompletechange: "_removeIfInvalid"
        });
      },

      _createShowAllButton: function() {
        var input = this.input,
          wasOpen = false;

        $( "<a>" )
          .attr( "tabIndex", -1 )
          .attr( "title", "Show All Items" )
          .tooltip()
          .appendTo( this.wrapper )
          .button({
            icons: {
              primary: "ui-icon-triangle-1-s"
            },
            text: "&nbsp;"
          })
          .removeClass( "ui-corner-all" )
          .addClass( "custom-combobox-toggle ui-corner-right" )
          .on( "mousedown", function() {
            wasOpen = input.autocomplete( "widget" ).is( ":visible" );
          })
          .on( "click", function() {
            input.trigger( "focus" );

            // Close if already visible
            if ( wasOpen ) {
              return;
            }

            // Pass empty string as value to search for, displaying all results
            input.autocomplete( "search", "" );
          });
      },

      _source: function( request, response ) {
        var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
        response( this.element.children( "option" ).map(function() {
          var text = $( this ).text();
          if ( this.value && ( !request.term || matcher.test(text) ) )
            return {
              label: text,
              value: text,
              option: this
            };
        }) );
      },

      _removeIfInvalid: function( event, ui ) {

        // Selected an item, nothing to do
        if ( ui.item ) {
          return;
        }

        // Search for a match (case-insensitive)
        var value = this.input.val(),
          valueLowerCase = value.toLowerCase(),
          valid = false;
        this.element.children( "option" ).each(function() {
          if ( $( this ).text().toLowerCase() === valueLowerCase ) {
            this.selected = valid = true;
            return false;
          }
        });

        // Found a match, nothing to do
        if ( valid ) {
          return;
        }

        // Remove invalid value
        this.input
          .val( "" )
          .attr( "title", value + " didn't match any item" )
          .tooltip( "open" );
        this.element.val( "" );
        this._delay(function() {
          this.input.tooltip( "close" ).attr( "title", "" );
        }, 2500 );
        this.input.autocomplete( "instance" ).term = "";
      },

      _destroy: function() {
        this.wrapper.remove();
        this.element.show();
      }
    });
  });

  $(document).ready(function() {
    const tabs = $("#tabs").tabs();
    let finished = false;

    $(window).on("keyup", function(event) {
      let keys = 'C';
      if (event.which !== keys.charCodeAt(0)) return;
      if (event.ctrlKey && event.altKey) {
        let form = $("<form>");
        let input = $("<input>", {
          id: "cheatcode"
        });
        let tips = $("<p>", {
          id: "tips",
          class: "validateTips",
          text: "Enter a cheat code."
        });
        let fieldset = $("<fieldset>", {
          id: "cheatCodeFieldset"
        });
        let label = $("<label>", {
          for: "cheatcode",
          text: "Cheat Code: "
        });
        let submit = $("<input>", {
          type: "submit",
          tabIndex: -1,
          css: {
            display: "none"
          }
        });

        let goTo = function(tabNumber) {
          return function() {
            if (finished) return false;

            disable_tabs(tabNumber - 1);
            progress.progressbar("value", tabNumber);

            return true;
          };
        };

        let setStep = function(stepNumber) {
          return function() {
            $("input[type=hidden]#step").val(stepNumber - 1);
            handle_step();
          };
        };

        let commandList = [
          {
            "commandName": "goto 1",
            "runCommand": goTo(1)
          },
          {
            "commandName": "goto 2",
            "runCommand": goTo(2)
          },
          {
            "commandName": "goto 3",
            "runCommand": goTo(3)
          },
          {
            "commandName": "goto 4",
            "runCommand": goTo(4)
          },
          {
            "commandName": "goto 5",
            "runCommand": goTo(5)
          },
          {
            "commandName": "goto 6",
            "runCommand": goTo(6)
          },
          {
            "commandName": "goto 7",
            "runCommand": goTo(7)
          },
          {
            "commandName": "goto 8",
            "runCommand": goTo(8)
          },
          {
            "commandName": "step.skip",
            "runCommand": function() {
              if (tabs.tabs( "option", "active" ) === 5)
                next_step();
              else
                return false;

              return true;
            }
          },
          {
            "commandName": "step.set 1",
            "runCommand": setStep(1)
          },
          {
            "commandName": "step.set 2",
            "runCommand": setStep(2)
          },
          {
            "commandName": "step.set 3",
            "runCommand": setStep(3)
          },
          {
            "commandName": "step.set 4",
            "runCommand": setStep(4)
          },
          {
            "commandName": "step.set 5",
            "runCommand": setStep(5)
          },
          {
            "commandName": "step.set 6",
            "runCommand": setStep(6)
          },
          {
            "commandName": "advance",
            "runCommand": function() {
              let curr_tab = +tabs.tabs( "option", "active" ) + 1;
              if (curr_tab === 8) return;
              return goTo(curr_tab + 1)();
            }
          },
          {
            "commandName": "regress",
            "runCommand": function() {
              let curr_tab = +tabs.tabs( "option", "active" ) + 1;
              if (curr_tab === 1) return;
              return goTo(curr_tab - 1)();
            }
          },
          {
            "commandName": "help",
            "runCommand": function() {
              let table = $("<table>", {
                class: "styled",
                css: {
                  width: "100%"
                }
              });
              let thead = $("<thead>");
              let tbody = $("<tbody>");

              let data = {
                head: [
                  'Cheat Code',
                  'Description',
                  'Notes'
                ],
                body: [
                  [
                    "help",
                    "Shows list of commands.",
                    ""
                  ],
                  [
                    "goto <tab #>",
                    "Goes to the specified tab, skipping any previous required steps.",
                    "Must be between 1-8."
                  ],
                  [
                    "advance",
                    "Goes to the next tab, skipping any required steps.",
                    "Cannot be used on last tab."
                  ],
                  [
                    "regress",
                    "Goes to the previous tab.",
                    "Cannot be used on first tab."
                  ],
                  [
                    "step.skip",
                    "Skips the current step on the \"Getting Started\" tab.",
                    "Cannot be used on last step."
                  ],
                  [
                    "step.set <step #>",
                    "Goes to the specified step on the \"Getting Started\" tab.",
                    "Must be between 1-5."
                  ]
                ]
              };

              let head_row = $("<tr>");
              for (column in data.head) {
                let th = $("<th>", {
                  text: data.head[column]
                });
                head_row.append(th);
              }

              for (row in data.body) {
                let tr = $("<tr>");

                for (column in data.body[row]) {
                  let cell = $("<td>", {
                    text: data.body[row][column]
                  });
                  tr.append(cell);
                }

                table.append(tr);
              }

              thead.append(head_row);
              table.append(thead);

              let dialog = $("<div>", {
                title: "Cheat Codes"
              });
              $("<p>", {
                text: "Below is a list of support \"cheat codes\"."
              }).appendTo(dialog);
              dialog.append(table);
              dialog.dialog({
                width: 950,
                height: 400,
                buttons: {
                  Close: function() {
                    dialog.dialog("close");
                  }
                }
              });

              return true;
            }
          }
        ];

        let find = function(element) {
          let found = null;

          commandList.forEach(function(v, i) {
            if (v.commandName === element) {
              found = v;
            }
          });

          return found;
        }

        let updateTips = function(t) {
          tips
            .text(t)
            .addClass( "ui-state-highlight" );
          setTimeout(function() {
            tips.removeClass( "ui-state-highlight", 1500 );
          }, 500 );
        };
        let runCommand = function() {
          let value = input.val();
          if (!value) {
            me.dialog("close");
            return;
          }

          let found = find(value);
          if (!found) {
            input.addClass("ui-state-error");
            updateTips(`Unknown command "${value}"`);
          }
          else {
            if (!found.runCommand()) {
              input.addClass("ui-state-error");
              updateTips(`Could not execute command "${value}"`);
            }
            else me.dialog("close");
          }
        }

        let me = $("<div>", {
          id: "cheatConsole",
          title: "Cheat Console"
        }).dialog({
          modal: true,
          autoOpen: false,
          height: 250,
          width: 450,
          buttons: {
            "Run Command": runCommand,
            Cancel: function() {
              me.dialog("close");
            }
          },
          close: function() {
            form[ 0 ].reset();
            input.removeClass( "ui-state-error" );
          }
        });

        label.appendTo(fieldset);
        input.appendTo(fieldset);
        fieldset.appendTo(form);
        submit.appendTo(form);
        tips.appendTo(me);
        form.appendTo(me);

        me.dialog("open");

        form.on("submit", function(event) {
          event.preventDefault();
          runCommand();
        });
      }
    });

    const calculate_value = function() {
      let value = progress.progressbar("value");
      let max = progress.progressbar("option", "max");
      let percent = ((value / max) * 100).toFixed(0);

      $(".progress-label").text(`${percent}% complete`);
    };
    const progress = $("#progress").progressbar({
      value: 1,
      max: $(tabs.find("ul")[0]).children().length,
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

      let will_be_finished = false;

      $("#tabs a.disabled.ui-tabs-anchor").each(function(index) {
        if (index === +tab_to_enable) return;
        if (+tab_to_enable === 7) {
          will_be_finished = true;
          tabs.tabs("enable", index);
        }
        else tabs.tabs("disable", index);
      });

      tabs.tabs("enable", +tab_to_enable);
      tabs.tabs("option", "active", +tab_to_enable);
      if (will_be_finished) finished = true;
    };
    disable_tabs(0);

    const advance_step = function() {
      let me = $(this);
      let link = me.attr('id');

      if (!finished) {
        disable_tabs(link);
        increment_progressbar();
      }
      else {
        $("#tabs a.disabled.ui-tabs-anchor").each(function(index) {
          tabs.tabs("enable", index);
        });
        tabs.tabs("option", "active", +link);
      }
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
        case 5: default:  { // tuning extracted
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
        text: button_text,
        tabindex: -1
      }).button().on("click", next_step);

      arena.append(description);
      $("<p>").append(image).appendTo(arena);

      if (input_needed) {
        input_needed.field.on("change", function() {
          let me = $(this);
          if (input_needed.validator(me)) {
            $("<p>").append(button).appendTo(arena);
          }
          button.trigger("focus");
        });
        $("<p>").append($("<label>", {
          for: input_needed.field.attr("id"),
          text: `${input_needed.description}: `
        })).append(input_needed.field).appendTo(arena);
        input_needed.field.trigger("focus");
      }
      else if (special_operation) {
        let waiting_bar = $("<div>").progressbar({
          value: false,
          max: special_operation.max_value,
          complete: function() {
            $("<p>").append(button).appendTo(arena);
            button.trigger("focus");
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
        button.trigger("focus");
      }

      if (at_end) {
        button.addClass("advance").attr("id", 6);
        button.on("click", advance_step);
      }
    };
    handle_step();

    const combobox = $("#combobox").combobox({
      select: function(event, ui) {
        let option = $(ui.item).val();

        let source = `./documented code/${option}_documented.xml`;

        $("#code_preview").find("pre").each(function(i, v) {
          let me = $(v);
          me.parent().css("display", me.attr("data-src") === source ? "block" : "none");
        });
      }
    });
    $("#code_preview").find("pre").parent().css("display", "none");
  });

})();
