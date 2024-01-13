let iDB,
  dataObjList,
  dataGrid,
  dataView,
  dataTable = [];
const commandQueue = [];
$(document).ready(function () {
  initializeIDB();
  createTableDiv();
  getExistingDataInTable();
  setupGrid();
  generateUI();
  createIdField();
  setupUITrigger();
  setupFormControlBtns();
});

function createTableDiv() {
  $("body").haml(
    // ["%div", { id: "table-div" }],
    [
      "%div",
      {
        id: "grid-div",
        style: "margin-top: 20px; width:1200px;height:150px;",
      },
    ]
  );
}

function generateUI() {
  const uiList = [["%h1", "Registration Form"]];
  $.each(formInputObjList, function (_, obj) {
    if (obj.fieldType === "text-input") {
      uiList.push(getTextInputUI(obj));
    }

    if (obj.fieldType === "date-picker") {
      uiList.push(getDateUI(obj));
    }

    if (obj.fieldType === "radio") {
      uiList.push(getRadioInputUI(obj));
    }

    if (obj.fieldType === "text-area") {
      uiList.push(getTextAreaInputUI(obj));
    }

    if (obj.fieldType === "select") {
      uiList.push(getSelectInputUI(obj));
    }

    if (obj.fieldType === "check-box") {
      uiList.push(getCheckboxInputUI(obj));
    }

    if (obj.fieldType === "boolean") {
      uiList.push(getBooleanInputUI(obj));
    }

    if (obj.fieldType === "multiple-select") {
      uiList.push(getMultiSelectInputUI(obj));
    }

    // if (obj.fieldType === "file") {
    //   uiList.push(getFileInputUI(obj));
    // }
  });
  $("body").haml(uiList);
}

function getTextInputUI(obj) {
  const fieldWidth = obj.width + "px";
  return [
    "%div",
    {
      id: obj.fieldId + "-div",
      style: "margin: 35px 0px;",
    },
    getLabelUI(obj),
    [
      "%input",
      {
        type: "text",
        id: obj.fieldId,
        name: obj.fieldId,
        placeholder: "Please enter " + obj.fieldLabel,
        style:
          "margin-left: 10px; padding: 5px; border; width:" + fieldWidth + ";",
      },
    ],
  ];
}

function getDateUI(obj) {
  const fieldWidth = obj.width + "px";
  return [
    "%div",
    { id: obj.fieldId + "-div", style: "margin: 35px 0px;" },
    getLabelUI(obj),
    [
      "%input",
      {
        type: "date",
        id: obj.fieldId,
        name: obj.fieldId,
        style: "margin-left: 10px; padding: 5px; width: " + fieldWidth + ";",
      },
    ],
  ];
}

function getRadioInputUI(obj) {
  return [
    "%div",
    {
      id: obj.fieldId + "-div",
      style: "margin: 35px 0px;",
    },
    getLabelUI(obj),
    getRadioUIList(obj),
  ];
}

function getRadioUIList(obj) {
  const RadioUIList = [];
  $.each(obj.options, function (optionID, optionValue) {
    RadioUIList.push([
      [
        "%input",
        {
          type: "radio",
          name: obj.fieldId,
          value: optionID,
          "display-value": optionValue,
        },
      ],
      optionValue,
    ]);
  });

  return RadioUIList;
}

function getTextAreaInputUI(obj) {
  const fieldWidth = obj.width + "px";
  return [
    "%div",
    { id: obj.fieldId + "-div", style: "margin-bottom: 35px;" },
    getLabelUI(obj),
    ["%br"],
    [
      "%textarea",
      {
        id: obj.fieldId,
        name: obj.fieldId,
        placeholder: "Please enter " + obj.fieldLabel,
        rows: 10,
        cols: 20,
        maxlength: 300,
        style: "padding: 5px; border; width:" + fieldWidth + ";",
      },
    ],
  ];
}

function getSelectInputUI(obj) {
  return [
    "%div",
    { id: obj.fieldId + "-div", style: "margin-top: 35px;" },
    getLabelUI(obj),
    [
      "%select",
      {
        id: obj.fieldId,
        name: obj.fieldId,
        style: "padding: 5px; margin-left: 10px;",
      },
      [
        "%option",
        {
          selected: true,
          disabled: true,
        },
      ],
      getSelectUIList(obj),
    ],
  ];
}

function getSelectUIList(obj) {
  const selectUIList = [];
  $.each(obj.options, function (optionID, optionValue) {
    selectUIList.push([
      [
        "%option",
        {
          id: optionID,
          name: obj.fieldId,
        },
        optionValue,
      ],
    ]);
  });
  return selectUIList;
}

function getCheckboxInputUI(obj) {
  return [
    "%div",
    { id: obj.fieldId + "-div", style: "margin-top: 35px;" },
    getLabelUI(obj),
    getCheckboxUIList(obj),
  ];
}

function getCheckboxUIList(obj) {
  const checkboxUIList = [];
  $.each(obj.options, function (optionID, optionValue) {
    checkboxUIList.push([
      "%div",
      [
        "%input",
        {
          type: "checkbox",
          id: optionID,
          name: obj.fieldId,
          value: optionValue,
        },
      ],
      optionValue,
    ]);
  });
  return checkboxUIList;
}

function getBooleanInputUI(obj) {
  return [
    "%div",
    {
      id: obj.fieldId + "-div",
      style: "margin-top: 35px;",
    },
    getLabelUI(obj),
    [
      "%input",
      {
        type: "checkbox",
        id: obj.fieldId,
        name: obj.fieldId,
      },
    ],
  ];
}

function getMultiSelectInputUI(obj) {
  return [
    "%div",
    {
      id: obj.fieldId + "-div",
      style: "margin-top: 35px;",
    },
    getLabelUI(obj),
    [
      "%select",
      {
        id: obj.fieldId,
        name: obj.fieldId,
        multiple: "true",
        style: "padding: 5px; margin-left: 10px;",
      },
      getMultiSelectList(obj),
    ],
  ];
}

function getMultiSelectList(obj) {
  const multiSelectList = [];
  $.each(obj.options, function (optionID, optionValue) {
    multiSelectList.push([
      [
        "%option",
        {
          id: optionID,
          name: obj.fieldId,
        },
        optionValue,
      ],
    ]);
  });

  return multiSelectList;
}

// function getFileInputUI(obj) {
//   return [
//     [
//       "%div",
//       {
//         id: obj.fieldId + "-div",
//       },
//       getLabelUI(obj),
//       [
//         "%input",
//         {
//           type: "file",
//           id: obj.fieldId,
//           name: obj.fieldId,
//           style: "margin-top: 35px;",
//         },
//       ],
//     ],
//   ];
// }

function setupFormControlBtns() {
  $("body").haml([
    [
      "%div",
      {
        style: "margin:25px 0px;",
      },
      [
        "%input",
        {
          type: "button",
          id: "registerButton",
          value: "Register",
          style: "margin-right:10px; padding: 5px",
        },
      ],
      [
        "%input",
        {
          type: "button",
          id: "resetButton",
          value: "Reset",
          style: "margin-right:10px; padding: 5px",
        },
      ],
    ],
  ]);
}

function getLabelUI(obj) {
  return [
    "%label",
    { for: obj.fieldId, style: "width: 150px; font-weight:bold;" },
    obj.fieldLabel + ":",
    obj.isRequired ? ["%span", { style: "color:red;" }, "*"] : [],
  ];
}

function setupUITrigger() {
  $("body").on("click", "#registerButton", function () {
    const userInputObj = fetchUserInput();
    console.log(userInputObj);

    if (!validateUserInput(userInputObj)) {
      return;
    }
    saveDataToDB(userInputObj);
  });

  $("body").on("click", "#resetButton", function () {
    resetForm();
    return false;
  });

  $("body").on("click", ".field-values", function () {
    const recId = $(this).attr("recid");
    // console.log(recId);
    displayRecord(recId);
    $(".errors").remove();
  });
}

function fetchUserInput() {
  const userInputObj = {};
  $.each(formInputObjList, function (_, obj) {
    let fieldValue;
    if (["text-input", "date-picker", "text-area"].includes(obj.fieldType)) {
      fieldValue = $("#" + obj.fieldId)
        .val()
        .trim();
      if (obj.fieldType === "date-picker") {
        const year = fieldValue.slice(0, 4);
        const monthDay = fieldValue.slice(5, 10);
        fieldValue = monthDay + "-" + year;
        fieldValue = fieldValue.replaceAll("-", "/");
      }
      userInputObj[obj.fieldId] = fieldValue;
      console.log(fieldValue);
    }

    if (obj.fieldType === "radio") {
      fieldValue = $("body")
        .find("input[name=" + obj.fieldId + "]:checked")
        .val();
      // console.log(fieldValue);
      userInputObj[obj.fieldId] = obj.options[fieldValue];
    }

    if (obj.fieldType === "select") {
      fieldValue = $("body")
        .find("#" + obj.fieldId)
        .val();
      // console.log(fieldValue);
      userInputObj[obj.fieldId] = fieldValue;
    }

    if (obj.fieldType === "check-box") {
      const fieldValue = [];
      $("body")
        .find("input[type=checkbox]:checked")
        .each(function () {
          fieldValue.push($(this).val());
        });
      // console.log(fieldValue);
      userInputObj[obj.fieldId] = fieldValue;
    }

    if (obj.fieldType === "multiple-select") {
      fieldValue = $("#" + obj.fieldId).val();
      // console.log(fieldValue);
      userInputObj[obj.fieldId] = fieldValue;
    }

    if (obj.fieldType === "boolean") {
      fieldValue = $("body")
        .find($("input[name=" + obj.fieldId))
        .is(":checked");
      console.log(fieldValue);
      userInputObj[obj.fieldId] = fieldValue;
    }

    // if (obj.fieldType === "file") {
    //   let filePath = $("#" + obj.fieldId).val();
    //   let fieldValue = getFileName(filePath);
    //   // console.log(fieldValue);
    //   userInputObj[obj.fieldId] = fieldValue;
    // }
  });
  return userInputObj;
}

// function getFileName(filePath) {
//   const fileName = filePath.split("\\").pop().split("/").pop();
//   return fileName;
// }

function validateUserInput(userInputObj) {
  let isValidated = true;

  $(".errors").remove();
  /*global formInputObjList*/
  $.each(formInputObjList, function (_, inputObj) {
    const fieldValue = userInputObj[inputObj.fieldId];

    if (
      inputObj.isRequired !== undefined &&
      !validateIsRequired(inputObj, fieldValue)
    ) {
      isValidated = false;
      $("#" + inputObj.fieldId + "-div").haml([
        [
          "%div.errors",
          { style: "color: red;" },
          "Please enter " + inputObj.fieldLabel,
        ],
      ]);
    }

    if (
      inputObj.minLength !== undefined &&
      !validateMinLength(inputObj, fieldValue)
    ) {
      isValidated = false;
      $("#" + inputObj.fieldId + "-div").haml([
        [
          "%div.errors",
          { style: "color: red;" },
          "Minimum " + inputObj.minLength + " characters allowed",
        ],
      ]);
    }

    if (
      inputObj.maxLength !== undefined &&
      !validateMaxLength(inputObj, fieldValue)
    ) {
      isValidated = false;
      $("#" + inputObj.fieldId + "-div").haml([
        [
          "%div.errors",
          { style: "color: red;" },
          "Maximum " + inputObj.maxLength + " characters allowed",
        ],
      ]);
    }

    if (
      inputObj.minValue !== undefined &&
      !validateMinValue(inputObj, fieldValue)
    ) {
      isValidated = false;
      $("#" + inputObj.fieldId + "-div").haml([
        [
          "%div.errors",
          { style: "color: red;" },
          "Minimum value should be " + inputObj.minValue,
        ],
      ]);
    }

    if (
      inputObj.maxValue !== undefined &&
      !validateMaxValue(inputObj, fieldValue)
    ) {
      isValidated = false;
      $("#" + inputObj.fieldId + "-div").haml([
        [
          "%div.errors",
          { style: "color: red;" },
          "Maximum value should be " + inputObj.maxValue,
        ],
      ]);
    }

    if (
      inputObj.valueType !== undefined &&
      !validateValueType(inputObj, fieldValue)
    ) {
      isValidated = false;
      $("#" + inputObj.fieldId + "-div").haml([
        [
          "%div.errors",
          { style: "color: red;" },
          "Please enter " +
            inputObj.fieldLabel +
            " in " +
            inputObj.valueType +
            " format",
        ],
      ]);
    }

    if (
      inputObj.isUnique !== undefined &&
      !validateIsUnique(inputObj, fieldValue, userInputObj)
    ) {
      // console.log("if block of validateIsUnique");
      isValidated = false;
      $("#" + inputObj.fieldId + "-div").haml([
        [
          "%div.errors",
          { style: "color: red;" },
          inputObj.fieldLabel + " already exist",
        ],
      ]);
    }

    // console.log(inputObj.customValidator);
  });
  return isValidated;
}

function validateIsRequired(inputObj, fieldValue) {
  if (
    ["text-input", "date-picker", "text-area"].includes(inputObj.fieldType) &&
    fieldValue === ""
  ) {
    return false;
  }

  if (
    (inputObj.fieldType === "radio" && fieldValue === undefined) ||
    (inputObj.fieldType === "check-box" && fieldValue.length === 0) ||
    (inputObj.fieldType === "select" && fieldValue === null) ||
    (inputObj.fieldType === "multiple-select" && fieldValue.length === 0)
  ) {
    return false;
  }

  return true;
}

function validateMinLength(inputObj, fieldValue) {
  if (fieldValue !== "") {
    if (inputObj.minLength > fieldValue.length) {
      return false;
    }
  }
  return true;
}

function validateMaxLength(inputObj, fieldValue) {
  if (fieldValue !== "") {
    if (fieldValue.length > inputObj.maxLength) {
      return false;
    }
  }
  return true;
}

function validateMinValue(inputObj, fieldValue) {
  if (fieldValue !== "") {
    if (inputObj.minValue > fieldValue) {
      return false;
    }
  }
  return true;
}

function validateMaxValue(inputObj, fieldValue) {
  if (fieldValue !== "") {
    if (fieldValue > inputObj.maxValue) {
      return false;
    }
  }
  return true;
}

function validateValueType(inputObj, fieldValue) {
  if (fieldValue !== "") {
    if (inputObj.valueType === "int") {
      const intRegex = /^[0-9]+$/g;
      if (!intRegex.test(fieldValue)) {
        return false;
      }
    }

    if (inputObj.valueType === "float") {
      const floatRegex = /^[0-9]+[.][0-9]+$/g;
      if (!floatRegex.test(fieldValue)) {
        return false;
      }
    }

    if (inputObj.valueType === "string") {
      const strRegex = /^[A-Za-z\.' ]+$/g;
      if (!strRegex.test(fieldValue)) {
        return false;
      }
    }

    if (inputObj.valueType === "boolean") {
      console.log(typeof fieldValue);
      if (fieldValue === "true" || fieldValue === "false") {
        return true;
      } else {
        if (fieldValue !== "true" || fieldValue !== "false") {
          return false;
        }
      }
    }

    if (inputObj.valueType === "date") {
      fieldValue = fieldValue.trim();
      if (validateDate(fieldValue, inputObj) === false) {
        $("#" + inputObj.fieldId + "-div").haml([
          [
            "%div.errors",
            { style: "color: red;" },
            "Please enter a valid date in dd-mm-yyyy format",
          ],
        ]);
      }
    }
  }
  return true;
}

function validateDate(dateValue) {
  const regexForDate =
    /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
  if (regexForDate.test(dateValue)) {
    return true; //true if dateValue in dd-mm-yyyy || dd/mm/yyyy || dd.mm.yyyy format and is a valid date
  }
  return false; //else return false
}

function validateIsUnique(inputObj, fieldValue, userInputObj) {
  const fieldID = inputObj.fieldId,
    recID = $("#recid").val() === "" ? 0 : parseInt($("#recid").val(), 10);
  // console.log(recID);
  const rowID = userInputObj.id;
  // console.log(rowID);
  let isUnique = true;

  if (rowID === undefined) {
    $.each(dataObjList, function (_, dataObj) {
      if (dataObj[fieldID] === fieldValue && dataObj.id !== recID) {
        isUnique = false;
        console.log(inputObj.fieldLabel + " already exist");
        return false; // break
      }
    });
  } else {
    $.each(dataObjList, function (_, dataObj) {
      if (dataObj[fieldID] === fieldValue && dataObj.id !== rowID) {
        isUnique = false;
        console.log(inputObj.fieldLabel + " already exist");
        return false; // break
      }
    });
  }
  return isUnique;
}

// function customValidation(inputObj, fieldValue) {
//   if (fieldValue !== "") {
//     if (!validateEmailFormat(fieldValue)) {
//       return false;
//     }
//   }
//   return true;
// }

// function validateEmailFormat(email) {
//   const emailValidateReg =
//     /^\(?([^@.\!\-#+ ]([A-Za-z0-9.+]?))+[^./@+][@][a-zA-Z0-9]+[-_]?[a-zA-Z0-9]+\.[a-zA-Z]{2,4}(\.([a-zA-Z]{2,4}))?/g;

//   if (!emailValidateReg.test(email)) {
//     return false;
//   }
//   return true;
// }

// function validateEligibleUser(dob, listOfErrors) {
//   const userBirthYear = dob.slice(6, 10);
//   const year = parseInt(userBirthYear, 10);

//   if (year > 2004) {
//     errMsg = "you are not eligible to register, minimum age should be 18";
//     listOfErrors.push(errMsg);
//     return errMsg;
//   }
//   return "";
// }

function initializeIDB() {
  iDB = new Dexie("candidateDB");
  iDB
    .version(1)
    .stores({ candidate: "++id, &emailId, &phoneNo, name, postalAddress" });
  iDB.open();
}

function getExistingDataInTable() {
  $("body").find("#table-div").empty();
  $("body").find("#table-div").haml(getTableUI());

  iDB.candidate.toArray().then(function (dbDataObjList) {
    dataObjList = dbDataObjList;
    // console.log(dataObjList);
    // $("#list-table").haml(getTableData());
    populateGridTable();
    refreshGrid();
  });
}

function getTableUI() {
  return [
    [
      "%div",
      {
        style: "margin: 25px 0px;",
      },
      [
        "%table",
        {
          id: "list-table",
          style: "border:1px solid black;",
        },
        ["%tr", getTableHead()],
      ],
    ],
  ];
}

function getTableHead() {
  const tableHead = [];

  $.each(formInputObjList, function (_, inputObj) {
    tableHead.push([
      "%th",
      {
        style: "padding:3px; border:1px solid black;",
      },
      inputObj.fieldLabel,
    ]);
  });
  return tableHead;
}

// function getTableData() {
//   const rowsList = [];
//   $.each(dataObjList, function (_, dataObj) {
//     rowsList.push(["%tr", renderRow(dataObj)]);
//   });
//   return rowsList;
// }

// function getDisplayData(inputObj, dataObj, dataValue) {
//   let displayData = dataValue;
//   if (
//     inputObj.fieldType === "check-box" ||
//     inputObj.fieldType === "multiple-select"
//   ) {
//     displayData = dataValue.join(", ");
//   }
//   return [
//     "%a.field-values",
//     { href: "#", recid: dataObj.id, style: "color:DodgerBlue;" },
//     displayData,
//   ];
// }

// function renderRow(dataObj) {
//   const row = [];
//   $.each(formInputObjList, function (_, inputObj) {
//     row.push([
//       "%td",
//       {
//         style: "padding:3px;border:1px solid black;",
//       },
//       getDisplayData(inputObj, dataObj, dataObj[inputObj.fieldId]),
//     ]);
//   });
//   return row;
// }

function displayRecord(recId) {
  $.each(dataObjList, function (_, dataObj) {
    if (dataObj.id == recId) {
      displayDataObj(dataObj);
    }
  });
}

function displayDataObj(dataObj) {
  // console.log(dataObj);
  $("body").find("#recid").val(dataObj.id);
  $.each(formInputObjList, function (_, inputObj) {
    let fieldValue = dataObj[inputObj.fieldId];
    if (inputObj.fieldType === "date-picker") {
      if (fieldValue.includes("/")) {
        const year = fieldValue.slice(6, 10);
        const monthDay = fieldValue.slice(0, 5);
        // console.log(monthDay);
        // console.log(year);
        fieldValue = year + "/" + monthDay;
        fieldValue = fieldValue.split("/").join("-");
      }
      // console.log(fieldValue);
    }

    if (
      ["text-input", "date-picker", "text-area", "select"].includes(
        inputObj.fieldType
      )
    ) {
      $("body")
        .find("#" + inputObj.fieldId)
        .val(fieldValue);
      // console.log(fieldValue);
    }
    if (inputObj.fieldType === "multiple-select") {
      if (typeof fieldValue === "string") {
        fieldValue = fieldValue.split(",");
        // console.log(fieldValue);
      }
      $("body")
        .find("#" + inputObj.fieldId)
        .val(fieldValue);
    }
    if (inputObj.fieldType === "radio") {
      // console.log(inputObj.fieldId);
      $("body")
        .find(
          "input[name=" +
            inputObj.fieldId +
            "][display-value=" +
            fieldValue +
            "]"
        )
        .prop("checked", true);
    }

    if (inputObj.fieldType === "boolean") {
      console.log(fieldValue);
      if (fieldValue) {
        $("body")
          .find("input[name=" + inputObj.fieldId + "]")
          .prop("checked", true);
      } else {
        $("body")
          .find("input[name=" + inputObj.fieldId + "]")
          .prop("checked", false);
      }
    }
    if (inputObj.fieldType === "check-box") {
      $.each(fieldValue, function (_, fieldValueItem) {
        $("body")
          .find(
            "input[type=checkbox][id=" +
              getCheckboxIdFromValue(inputObj, fieldValueItem) +
              "]"
          )
          .prop("checked", true);
      });
    }
  });
}

function getCheckboxIdFromValue(inputObj, checkboxValue) {
  let checkboxId = "";
  $.each(inputObj.options, function (optionId, optionValue) {
    if (optionValue === checkboxValue) {
      checkboxId = optionId;
      return false; // break
    }
  });
  return checkboxId;
}

function resetForm() {
  $("body").find("input:text, textarea, select").val("");
  $("body").find("input[type=date]").val("");
  $("body").find("input:radio, input:checkbox").prop("checked", false);
  $(".errors").remove();
}

function createIdField() {
  $("body").haml([
    "%div",
    {
      style: "margin: 35px 0px;",
    },
    [("%label", "RecId:")],
    [
      "%input",
      {
        type: "text",
        id: "recid",
        name: "recid",
        readonly: true,
      },
    ],
  ]);
}

function saveDataToDB(userInputObj) {
  const recId = $("#recid").val();
  if (recId !== "") {
    userInputObj.id = parseInt(recId, 10);
  }

  iDB.candidate
    .put(userInputObj)
    .then(() => {
      getExistingDataInTable();
    })
    .catch((err) => {
      console.log(err);
    });
}

function setupGrid() {
  const columnList = [];
  $.each(formInputObjList, function (idx, obj) {
    const columnObj = {
      id: obj.fieldId,
      name: obj.fieldLabel,
      field: obj.fieldId,
      width: 150,
    };
    if (idx === 0) {
      columnObj.formatter = columnValueFormatter;
    } else {
      if (obj.fieldType === "text-input") {
        columnObj.editor = Slick.Editors.Text;
      }

      if (obj.fieldType === "text-area") {
        columnObj.editor = Slick.Editors.LongText;
      }

      if (obj.fieldType === "date-picker") {
        columnObj.editor = Slick.Editors.Flatpickr;
      }

      if (obj.fieldType === "radio") {
        columnObj.options = getOptions(obj).toString();
        columnObj.editor = SelectCellEditor;
      }

      if (obj.fieldType === "select") {
        columnObj.options = getOptions(obj).toString();
        columnObj.editor = SelectCellEditor;
      }

      if (obj.fieldType === "multiple-select") {
        columnObj.editor = MultiSelectDropdownEditor;
      }

      if (obj.fieldType === "boolean") {
        columnObj.editor = Slick.Editors.Checkbox;
        columnObj.formatter = Slick.Formatters.Checkmark;
        columnObj.cssClass = "cell-checkbox";
        columnObj.width = 80;
        columnObj.minWidth = 20;
        columnObj.maxWidth = 80;
      }
    }
    columnList.push(columnObj);
  });
  const options = {
    editable: true,
    enableCellNavigation: true,
    enableColumnReorder: false,
    editCommandHandler: queueAndExecuteCommand,
  };

  dataView = new Slick.Data.DataView();

  dataGrid = new Slick.Grid("#grid-div", dataView, columnList, options);
  refreshGrid();
  cellValueChanged();
}

function cellValueChanged() {
  dataGrid.onCellChange.subscribe(function (e, args) {
    alert("changed cell value");
    const userInputObj = args.item;
    if (!validateUserInput(userInputObj)) {
      alert("Error in grid value");
      console.log("Error in Grid");
      undo();
      return;
    }
    saveUpdatedGridToDB(userInputObj);
  });
  return false;
}

function columnValueFormatter(row, cell, value, columnDef, dataContext) {
  // console.log(dataContext);
  return (
    "<a class=field-values href=# style=color:Black recid=" +
    dataContext.id +
    ">" +
    value +
    "</a>"
  );
}

function populateGridTable() {
  dataTable = [];
  $.each(dataObjList, function (i, dataObj) {
    dataTable.push(dataObj);
  });
}

function refreshGrid() {
  dataView.setItems(dataTable);
  dataGrid.invalidate();
}

function saveUpdatedGridToDB(userInputObj) {
  console.log(userInputObj.id);
  iDB.candidate
    .put(userInputObj)
    .then(() => {
      // console.log("referesh indexedDB to see changes");
    })
    .catch(() => {
      // console.log("");
    });
}

function getOptions(obj) {
  const optionList = [];
  $.each(obj.options, function (optionID, optionValue) {
    optionList.push(optionValue);
  });
  return optionList;
}

function SelectCellEditor(args) {
  var $select;
  var defaultValue;
  var scope = this;

  this.init = function () {
    if (args.column.options) {
      opt_values = args.column.options.split(",");
    } else {
      opt_values = "yes,no".split(",");
    }
    let option_str = "";
    for (const i in opt_values) {
      var v = opt_values[i];
      option_str += "<OPTION value='" + v + "'>" + v + "</OPTION>";
    }
    $select = $(
      "<SELECT tabIndex='0' class='editor-select'>" + option_str + "</SELECT>"
    );
    $select.appendTo(args.container);
    $select.focus();
  };

  this.destroy = function () {
    $select.remove();
  };

  // this.focus = function () {
  //   $select.focus();
  // };

  this.loadValue = function (item) {
    defaultValue = item[args.column.field];
    $select.val(defaultValue);
  };

  this.serializeValue = function () {
    if (args.column.options) {
      return $select.val();
    }
  };

  this.applyValue = function (item, state) {
    item[args.column.field] = state;
  };

  this.isValueChanged = function () {
    return $select.val() != null;
  };

  this.validate = function () {
    return {
      valid: true,
      msg: null,
    };
  };

  this.init();
}

class MultiSelectDropdownEditor {
  constructor(args) {
    var $input,
      $wrapper,
      $checkBoxInput,
      selectedchkBoxArray = [];
    var defaultValue;
    var scope = this;
    // check scope get this value
    var chkBoxListData = getChkBoxDataList(args);
    var chkBoxAllValues = chkBoxListData.AllValues;
    var selectedchkBox = chkBoxListData.SelectedValues;
    if (!(selectedchkBox === undefined || selectedchkBox.length === 0)) {
      if (selectedchkBox.length > 0) {
        selectedchkBoxArray = selectedchkBox;
      }
    }
    this.init = function () {
      if (chkBoxAllValues.length != 0) {
        var $container = $("body");
        $wrapper = $(
          "<DIV style='z-index:10000;position:absolute;background:white;padding:5px;border:3px solid gray; -moz-border-radius:10px; border-radius:10px;'/>"
        ).appendTo($container);

        for (var i = 0; i < chkBoxAllValues.length; i++) {
          if (
            !(selectedchkBoxArray === undefined || selectedchkBoxArray === "")
          ) {
            if (
              selectedchkBoxArray.length > 0 &&
              selectedchkBoxArray.indexOf(chkBoxAllValues[i]) > -1
            ) {
              $checkBoxInput = $(
                "<input class='chkBox' type='checkbox' name='" +
                  chkBoxAllValues[i] +
                  "' id='chkBox_" +
                  i +
                  "' checked='checked'/>" +
                  chkBoxAllValues[i] +
                  "<br />"
              );
            } else
              $checkBoxInput = $(
                "<input class='chkBox' type='checkbox' name='" +
                  chkBoxAllValues[i] +
                  "' id='chkBox_" +
                  i +
                  "'/>" +
                  chkBoxAllValues[i] +
                  "<br />"
              );
          } else
            $checkBoxInput = $(
              "<input class='chkBox' type='checkbox' name='" +
                chkBoxAllValues[i] +
                "' id='chkBox_" +
                i +
                "'/>" +
                chkBoxAllValues[i] +
                "<br />"
            );

          $wrapper.append($checkBoxInput);
        }

        $wrapper.append("<br/><br/>");

        $input = $(
          "<TEXTAREA style='display:none;' hidefocus rows=25 style='background:white;width:150px;height:100px;border:1px solid;outline:0'>"
        ).appendTo($wrapper);

        $(
          "<DIV style='text-align:right'><BUTTON>Save</BUTTON><BUTTON>Cancel</BUTTON></DIV>"
        ).appendTo($wrapper);

        $wrapper.find("button:first").on("click", this.save);
        $wrapper.find("button:last").on("click", this.cancel);
        $input.on("keydown", this.handleKeyDown);
      } else {
        alert(
          "Dropdown list is empty. Kindly provide data for this dropdown list"
        );
      }
      scope.position(args.position);
      $input.focus().select();

      $('input[type="checkbox"]').change(function () {
        var name = $(this).prop("name");
        var chkboxId = $(this).prop("id");
        var check = $(this).prop("checked");
        var currentValue = $input.val();
        if (check) {
          var allSelectedValues = "";
          $('input[type="checkbox"]').each(function () {
            var isChecked = $(this).prop("checked");
            var name = $(this).prop("name");
            var currentChekBoxId = $(this).prop("id");
            if (isChecked) {
              if (allSelectedValues.length == 0) allSelectedValues = name;
              else allSelectedValues = allSelectedValues + "," + name;
            }
          });
          $input.val("");
          $input.val(allSelectedValues);
        } else {
          allSelectedValues = "";
          $('input[type="checkbox"]').each(function () {
            var isChecked = $(this).prop("checked");

            var name = $(this).prop("name");
            var currentChekBoxId = $(this).prop("id");
            if (isChecked) {
              if (allSelectedValues.length == 0) allSelectedValues = name;
              else allSelectedValues = allSelectedValues + "," + name;
            }
          });
          $input.val("");
          $input.val(allSelectedValues);
        }
      });
      var allSelValues = "";
      $('input[type="checkbox"]').each(function () {
        var isChecked = $(this).prop("checked");

        var name = $(this).prop("name");
        var currentChekBoxId = $(this).prop("id");
        if (isChecked) {
          if (allSelValues.length == 0) allSelValues = name;
          else allSelValues = allSelValues + "," + name;
        }
      });
      $input.val("");
      $input.val(allSelValues);
    };

    this.handleKeyDown = function (e) {
      if (e.which == $.ui.keyCode.ENTER && e.ctrlKey) {
        console.log(scope);
        scope.save();
      } else if (e.which == $.ui.keyCode.ESCAPE) {
        e.preventDefault();
        scope.cancel();
      } else if (e.which == $.ui.keyCode.TAB && e.shiftKey) {
        e.preventDefault();
        args.grid.navigatePrev();
      } else if (e.which == $.ui.keyCode.TAB) {
        e.preventDefault();
        args.grid.navigateNext();
      }
    };

    this.save = function () {
      args.commitChanges();
      $wrapper.hide();
    };

    this.cancel = function () {
      $input.val(defaultValue);
      args.cancelChanges();
    };

    this.hide = function () {
      $wrapper.hide();
    };

    this.show = function () {
      $wrapper.show();
    };

    this.position = function (position) {
      $wrapper.css("top", position.top - 5).css("left", position.left - 5);
    };

    this.destroy = function () {
      $wrapper.remove();
    };

    this.focus = function () {
      $input.focus();
    };

    this.loadValue = function (item) {
      $input.val((defaultValue = item[args.column.field]));
    };

    this.serializeValue = function () {
      return $input.val();
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return (
        !($input.val() == "" && defaultValue == null) &&
        $input.val() != defaultValue
      );
    };

    this.validate = function () {
      if (args.column.validator) {
        var validationResults = args.column.validator($input.val());
        if (!validationResults.valid) {
          return validationResults;
        }
      }

      return {
        valid: true,
        msg: null,
      };
    };

    this.init();
  }
}

function getChkBoxDataList(args) {
  const dropdownListData = [];

  $.each(formInputObjList, function (_, obj) {
    if (obj.fieldType === "multiple-select") {
      getChkboxOptions(obj, dropdownListData);
    }
  });

  // console.log(args);
  if (args.column.id === "preferredTiming") {
    const timeData = {
      AllValues: dropdownListData,
      SelectedValues: args.item.preferredTiming,
    };

    // console.log(timeData);
    return timeData;
  }
}

function getChkboxOptions(obj, DropdownListData) {
  $.each(obj.options, function (optionID, optionValue) {
    if (obj.fieldType === "multiple-select") {
      DropdownListData.push(optionValue);
    }
  });
}

function queueAndExecuteCommand(item, column, editCommand) {
  commandQueue.push(editCommand);
  editCommand.execute();
}

function undo() {
  var command = commandQueue.pop();
  if (command && Slick.GlobalEditorLock.cancelCurrentEdit()) {
    command.undo();
    dataGrid.gotoCell(command.row, command.cell, false);
  }
}
