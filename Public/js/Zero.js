String.prototype.replaceAll = function(search, replacement) {
    if(this.indexOf(search) !== -1)
    {
        var target = this;
        return target.split(search).join(replacement);
    } else return this;
    
};


Date.prototype.addDate = function(n){
    this.setDate(this.getDate() + n);
    return this;
};

function download(filename, text) {
    var element = document.createElement('a');
    var universalBOM = "\uFEFF";
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(universalBOM + text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function getUrl(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

function AjaxAsync(urlsend,dtsend,typeSend = "GET", datatype = "html") {
    var it_works;

    $.ajax({
        url: urlsend,
        type: typeSend.toUpperCase(),
        dataType: datatype.toUpperCase(),
        cache: false,
        data: dtsend,
        success: function(string){	
            it_works = string;
        },
        error: function (){
            it_works = 'ERROR';
        },
        async: false
    });
    return it_works;
}

function AjaxNonAsync(urlsend,dtsend,typeSend = "GET", datatype = "html") {
    $.ajax({
        url: urlsend,
        type: typeSend.toUpperCase(),
        dataType: datatype.toUpperCase(),
        cache: false,
        data: dtsend,
        success: function(string){	
            console.log(string);
        },
        error: function (){
            console.log("Error");
        },
        async: true
    });
}


function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

Date.prototype.yyyymmdd = function() {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();
    var hh = this.getHours();
    var MM = this.getMinutes();

    return [this.getFullYear(),(mm>9 ? '' : '0') + mm,(dd>9 ? '' : '0') + dd
            ].join('-') + " " + [(hh>9 ? '' : '0') + hh,(MM>9 ? '' : '0') + MM].join(':');
};

function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.style.position = "fixed";
    textArea.style.top = 0;
    textArea.style.left = 0;

    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn\"t work as this gives a negative w/h on some browsers.
    textArea.style.width = "2em";
    textArea.style.height = "2em";

    // We don"t need padding, reducing the size if it does flash render.
    textArea.style.padding = 0;

    // Clean up any borders.
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";

    // Avoid flash of white box if rendered for any reason.
    textArea.style.background = "transparent";


    textArea.value = text;

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand("copy");
        var msg = successful ? "successful" : "unsuccessful";
        console.log("Copying text command was " + msg);
    } catch (err) {
        console.log("Oops, unable to copy");
    }

    document.body.removeChild(textArea);
}

dhtmlXGridObject.prototype.AddClipBoard=async function(dp){
    console.log(dp);
    await sleep(150);
    var LastRow = this.getRowsNum();
    var LastColumn = this.getColumnsNum();
    var top_row = this.getSelectedBlock().LeftTopRow;
    var IndexRow = this.getRowIndex(top_row);
    var bottom_row = this.getSelectedBlock().RightBottomRow;
    var left_column = this.getSelectedBlock().LeftTopCol;
    var right_column = this.getSelectedBlock().RightBottomCol;
    var clipText = CopyClipBoard;
    var RowData = clipText.split("\r\n");
    var newId = (new Date()).valueOf();
    if(LastColumn - left_column < RowData[0].split("\t").length) {
        dhtmlx.alert("Cột nhiều hơn, vui lòng dán đúng vị trí");
        return;
    } else {
        var TurnAdd = false;
        var SplitString = "";
        var StringLength = 0;
        var ArrAdd = [];
        var IS = 1;
        var EX = ["text/plain", "text/html", "text/rtf", "Files"];
        if(EX.length == CT.length) {
            for(var x = 0; x < CT.length; x++) {
                if(EX[x] != CT[x]) {
                    IS = 1;
                    break;
                }
            }
        } else {
            IS = 0;
        }
        for(var i = 0; i < RowData.length - IS; i++){
            SplitString = RowData[i].split("\t");
            ArrAdd = [];
            if(IndexRow + i == this.getRowsNum() && i != 0) {
                for(var t = 0; t < left_column; t++) ArrAdd.push("");
                for(var j = 0; j < SplitString.length; j++) {
                    if(SplitString[j][0] == '"' && SplitString[j][SplitString[j].length - 1] == '"') {
                        SplitString[j] = SplitString[j].substring(1,SplitString[j].length - 2);
                    }
                    ArrAdd.push(SplitString[j]);
                }
                this.addRow(this.getRowsNum() + 1,ArrAdd);
                TurnAdd = true;
            } else {
                for(var j = 0; j < SplitString.length; j++) {
                    if(SplitString[j][0] == '"' && SplitString[j][SplitString[j].length - 1] == '"') {
                        SplitString[j] = SplitString[j].substring(1,SplitString[j].length - 2);
                    }
                    this.cells2(IndexRow + i,left_column + j).setValue(SplitString[j]);
                    if(dp != null) dp.setUpdated(this.getRowId(IndexRow + i),true);
                }
            }
        }
        if(TurnAdd) this.addRow(this.getRowsNum() + 1,[""]);
    }
}
            
            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            dhtmlXGridObject.prototype.SelectCellEditor=function(){
                if(this.editor && this.editor.obj){
                    this.editor.obj.select();
                }
            };



            
    dhtmlXGridObject.prototype.getColumnCombo = function(a) {
        if (this._col_combos && this._col_combos[a]) {
            return this._col_combos[a]
        }
        if (!this._col_combos) {
            this._col_combos = []
        }
        this._col_combos[a] = eXcell_combo.prototype.initCombo.call({
            grid: this
        }, a);
        return this._col_combos[a]
    };

    function eXcell_combo(a) {
        if (!a) {
            return
        }
        this.cell = a;
        this.grid = a.parentNode.grid;
        this._combo_pre = "";
        this.edit = function() {
            if (!window.dhx_globalImgPath) {
                window.dhx_globalImgPath = this.grid.imgURL
            }
            this.val = this.getValue();
            var c = this.getText();
            if (this.cell._clearCell) {
                c = ""
            }
            this.cell.innerHTML = "";
            if (!this.cell._brval) {
                this.combo = (this.grid._realfake ? this.grid._fake : this.grid)._col_combos[this.cell._cellIndex]
            } else {
                this.combo = this.cell._brval
            }
            this.cell.appendChild(this.combo.DOMParent);
            this.combo.DOMParent.style.margin = "0";
            this.combo.DOMelem_input.focus();
            this.combo.setSize(this.cell.offsetWidth - 2);
            if (!this.combo._xml) {
                if (this.combo.getIndexByValue(this.cell.combo_value) != -1) {
                    this.combo.selectOption(this.combo.getIndexByValue(this.cell.combo_value))
                } else {
                    if (this.combo.getOptionByLabel(c)) {
                        this.combo.selectOption(this.combo.getIndexByValue(this.combo.getOptionByLabel(c).value))
                    } else {
                        this.combo.setComboText(c)
                    }
                }
            } else {
                this.combo.setComboText(c)
            }
            this.combo.openSelect()
        };
        this.selectComboOption = function(e, c) {
            c.selectOption(c.getIndexByValue(c.getOptionByLabel(e).value))
        };
        this.getValue = function(c) {
            return this.cell.combo_value || ""
        };
        this.getText = function(e) {
            var g = this.cell;
            if (this._combo_pre == "" && g.childNodes[1]) {
                g = g.childNodes[1]
            } else {
                g.childNodes[0].childNodes[1]
            }
            return (_isIE ? g.innerText : g.textContent)
        };
        this.setValue = function(h) {
            if (typeof(h) == "object") {
                this.cell._brval = this.initCombo();
                var e = this.cell._cellIndex;
                var g = this.cell.parentNode.idd;
                if (!h.firstChild) {
                    this.cell.combo_value = "&nbsp;";
                    this.cell._clearCell = true
                } else {
                    this.cell.combo_value = h.firstChild.data
                }
                this.setComboOptions(this.cell._brval, h, this.grid, e, g)
            } else {
                this.cell.combo_value = h;
                var c = null;
                if ((c = this.cell._brval) && (typeof(this.cell._brval) == "object")) {
                    h = (c.getOption(h) || {}).text || h
                } else {
                    if (c = this.grid._col_combos[this.cell._cellIndex] || ((this.grid._fake) && (c = this.grid._fake._col_combos[this.cell._cellIndex]))) {
                        h = (c.getOption(h) || {}).text || h
                    }
                }
                if ((h || "").toString()._dhx_trim() == "") {
                    h = null
                }
                if (h !== null) {
                    this.setComboCValue(h)
                } else {
                    this.setComboCValue("&nbsp;", "");
                    this.cell._clearCell = true
                }
            }
        };
        this.detach = function() {
            var c = this.combo.getParent();
            if (c.parentNode == this.cell) {
                this.cell.removeChild(c)
            } else {
                return false
            }
            var e = this.cell.combo_value;
            this.combo._confirmSelect("blur");
            if (!this.combo.getComboText() || this.combo.getComboText().toString()._dhx_trim() == "") {
                this.setComboCValue("&nbsp;");
                this.cell._clearCell = true
            } else {
                this.setComboCValue(this.combo.getComboText().replace(/\&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), this.combo.getActualValue());
                this.cell._clearCell = false
            }
            this.cell.combo_value = this.combo.getActualValue();
            this.combo.closeAll();
            this.grid._still_active = true;
            this.grid.setActive(1);
            return e != this.cell.combo_value
        }
    }
    eXcell_combo.prototype = new eXcell;
    eXcell_combo_v = function(a) {
        var c = new eXcell_combo(a);
        c._combo_pre = "<img src='" + (window.dhx_globalImgPath ? window.dhx_globalImgPath : this.grid.imgURL) + "combo_select" + (dhtmlx.skin ? "_" + dhtmlx.skin : "") + ".gif' class='dhxgrid_combo_icon'/>";
        return c
    };
    eXcell_combo.prototype.initCombo = function(c) {
        var a = document.createElement("DIV");
        a.className = "dhxcombo_in_grid_parent";
        var g = this.grid.defVal[arguments.length ? c : this.cell._cellIndex];
        var h = new dhtmlXCombo(a, "combo", 0, g);
        this.grid.defVal[arguments.length ? c : this.cell._cellIndex] = "";
        var e = this.grid;
        h.DOMelem.onmousedown = h.DOMelem.onclick = function(l) {
            l = l || event;
            l.cancelBubble = true
        };
        h.DOMelem.onselectstart = function(l) {
            l = l || event;
            l.cancelBubble = true;
            return true
        };
        this.grid.attachEvent("onScroll", function() {
            if (h._isListVisible()) {
                h._hideList()
            }
        });
        h.attachEvent("onKeyPressed", function(l) {
            if (l == 13 || l == 27) {
                e.editStop();
                if (e._fake) {
                    e._fake.editStop()
                }
            }
        });
        return h
    };
    eXcell_combo.prototype.fillColumnCombos = function(e, a) {
        if (!a) {
            return
        }
        var g = dhx4.ajax.xmltop("rows", a, -1);
        if (g && g.tagName !== "DIV") {
            e.combo_columns = e.combo_columns || [];
            columns = dhx4.ajax.xpath("//column", g);
            for (var c = 0; c < columns.length; c++) {
                if ((columns[c].getAttribute("type") || "").indexOf("combo") == 0) {
                    e.combo_columns[e.combo_columns.length] = c;
                    this.setComboOptions(e._col_combos[c], columns[c], e, c)
                }
            }
        }
    };
    eXcell_combo.prototype.setComboCValue = function(e, c) {
        if (this._combo_pre != "") {
            var a = (this.cell.offsetHeight ? this.cell.offsetHeight + "px" : 0);
            e = "<div style='width:100%;position:relative;height:100%;overflow:hidden;'>" + this._combo_pre + "<span>" + e + "</span></div>"
        }
        if (arguments.length > 1) {
            this.setCValue(e, c)
        } else {
            this.setCValue(e)
        }
    };
    eXcell_combo.prototype.setComboOptions = function(l, m, e, r, u) {
        if (window.dhx4.s2b(m.getAttribute("xmlcontent"))) {
            if (!m.getAttribute("source")) {
                options = m.childNodes;
                var a = [];
                for (var n = 0; n < options.length; n++) {
                    if (options[n].tagName == "option") {
                        var g = options[n].firstChild ? options[n].firstChild.data : "";
                        a[a.length] = [options[n].getAttribute("value"), g, (options[n].getAttribute("css") || "")]
                    }
                }
                l.addOption(a);
                if (arguments.length == 4) {
                    e.forEachRowA(function(w) {
                        var v = e.cells(w, r);
                        if (!v.cell._brval && !v.cell._cellType && (v.cell._cellIndex == r)) {
                            if (v.cell.combo_value == "") {
                                v.setComboCValue("&nbsp;", "")
                            } else {
                                if (!l.getOption(v.cell.combo_value)) {
                                    v.setComboCValue(v.cell.combo_value)
                                } else {
                                    v.setComboCValue(l.getOption(v.cell.combo_value).text, v.cell.combo_value)
                                }
                            }
                        }
                    })
                } else {
                    var s = (this.cell) ? this : e.cells(u, r);
                    if (m.getAttribute("text")) {
                        if (m.getAttribute("text")._dhx_trim() == "") {
                            s.setComboCValue("&nbsp;", "")
                        } else {
                            s.setComboCValue(m.getAttribute("text"))
                        }
                    } else {
                        if ((!s.cell.combo_value) || (s.cell.combo_value._dhx_trim() == "")) {
                            s.setComboCValue("&nbsp;", "")
                        } else {
                            if (!l.getOption(s.cell.combo_value)) {
                                s.setComboCValue(s.cell.combo_value)
                            } else {
                                s.setComboCValue(l.getOption(s.cell.combo_value).text, s.cell.combo_value)
                            }
                        }
                    }
                }
            }
        }
        if (m.getAttribute("source")) {
            if (m.getAttribute("auto") && window.dhx4.s2b(m.getAttribute("auto"))) {
                if (m.getAttribute("xmlcontent")) {
                    var s = (this.cell) ? this : e.cells(u, r);
                    if (m.getAttribute("text")) {
                        s.setComboCValue(m.getAttribute("text"))
                    }
                } else {
                    e.forEachRowA(function(y) {
                        var x = e.cells(y, r);
                        if (!x.cell._brval && !x.cell._cellType) {
                            var w = x.cell.combo_value.toString();
                            if (w.indexOf("^") != -1) {
                                var v = w.split("^");
                                x.cell.combo_value = v[0];
                                x.setComboCValue(v[1])
                            }
                        }
                    })
                }
                l.enableFilteringMode(true, m.getAttribute("source"), window.dhx4.s2b(m.getAttribute("cache") || true), window.dhx4.s2b(m.getAttribute("sub") || false))
            } else {
                var o = this;
                var h = arguments.length;
                l.load(m.getAttribute("source"), function() {
                    if (h == 4) {
                        e.forEachRow(function(x) {
                            var w = e.cells(x, r);
                            if (!w.cell._brval && !w.cell._cellType) {
                                if (l.getOption(w.cell.combo_value)) {
                                    w.setComboCValue(l.getOption(w.cell.combo_value).text, w.cell.combo_value)
                                } else {
                                    if ((w.cell.combo_value || "").toString()._dhx_trim() == "") {
                                        w.setComboCValue("&nbsp;", "");
                                        w.cell._clearCell = true
                                    } else {
                                        w.setComboCValue(w.cell.combo_value)
                                    }
                                }
                            }
                        })
                    } else {
                        var v = e.cells(u, r);
                        if (l.getOption(v.cell.combo_value)) {
                            v.setComboCValue(l.getOption(v.cell.combo_value).text, v.cell.combo_value)
                        } else {
                            v.setComboCValue(v.cell.combo_value)
                        }
                    }
                })
            }
        }
        if (!m.getAttribute("auto") || !window.dhx4.s2b(m.getAttribute("auto"))) {
            if (m.getAttribute("editable") && !window.dhx4.s2b(m.getAttribute("editable"))) {
                l.readonly(true)
            }
            if (m.getAttribute("filter") && window.dhx4.s2b(m.getAttribute("filter"))) {
                l.enableFilteringMode(true)
            }
        }
    };
    eXcell_combo.prototype.getCellCombo = function() {
        if (this.cell._brval) {
            return this.cell._brval
        }
        this.cell._brval = this.initCombo();
        return this.cell._brval
    };
    eXcell_combo.prototype.refreshCell = function() {
        this.setValue(this.getValue())
    };
    
    eXcell_combo.prototype.getCellCombo = function() {
        if (this.cell._brval) {
            return this.cell._brval
        }
        this.cell._brval = this.initCombo();
        return this.cell._brval
    };
    eXcell_combo.prototype.refreshCell = function() {
        this.setValue(this.getValue())
    };