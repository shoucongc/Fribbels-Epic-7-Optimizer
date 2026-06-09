const stringSimilarity = require('string-similarity');
const tinygradient = require('tinygradient');
const colorPicker = require('../colorPicker');

var lightGradient = {gradient:tinygradient('#ffffff', '#8fed78')};
var lightScoreGradient = {gradient:tinygradient('#ffa8a8', '#ffffe5', '#8fed78')};

var darkGradient = colorPicker.get2Colors();
// var darkGradient = tinygradient('#5A1A06', '#38821F');//Item Grid: Values
var darkScoreGradient = tinygradient('#5A1A06', '#343127', '#38821F'); //Not used?
var darkScoreGradient2 = colorPicker.getColors();
// var darkScoreGradient2 = tinygradient([
//     {color: '#5A1A06', pos: 0}, // red
//     {color: '#343127', pos: 0.4},
//     {color: '#38821F', pos: 1} // green
// ]); //Item Grid: Score

var gradient = lightGradient;
var scoreGradient = lightScoreGradient;


global.itemsGrid = null;
var currentAggregate = {};
var selectedCell = null;

module.exports = {
    async editedItem() {
        if (selectedCell) {
            response = await Api.getItemById(selectedCell.id);
            selectedCell = response.item;
            module.exports.redraw();
        }
    },

    toggleDarkMode(enabled) {
        if (enabled) {
            gradient = darkGradient;
            scoreGradient = darkScoreGradient2;
        } else {
            gradient = lightGradient;
            scoreGradient = lightScoreGradient;
        }

        try {
            itemsGrid.gridOptions.api.refreshView()
        } catch (e) {

        }
    },

    initialize: async () => {
        if (i18next.language == 'zh') {
          var localeText = AG_GRID_LOCALE_ZH;
        } else if (i18next.language == 'zh-TW') {
          var localeText = AG_GRID_LOCALE_ZH_TW;
        } else if (i18next.language == 'fr') {
          var localeText = AG_GRID_LOCALE_FR;
        } else if (i18next.language == 'ja') {
          var localeText = AG_GRID_LOCALE_JA;
        } else if (i18next.language == 'ko') {
          var localeText = AG_GRID_LOCALE_KO;
        } else if (i18next.language == 'ru') {
          var localeText = AG_GRID_LOCALE_RU;
        } else {
          var localeText = AG_GRID_LOCALE_EN;
        }
        console.log('localeText:'+localeText);

        const getAllItemsResponse = await Api.getAllItems();
        const gridOptions = {
            defaultColDef: {
                width: 45,
                sortable: true,
                sortingOrder: ['desc', 'asc', null],
                cellStyle: columnGradient,
                // valueFormatter: numberFormatter,
            },

            columnDefs: [
                {headerName: i18next.t('Set'), field: 'set', cellRenderer: (params) => renderSets(params.value)},
                {headerName: i18next.t('Gear'), field: 'gear', cellRenderer: (params) => renderGear(params.value)},
                {headerName: i18next.t('Rank'), field: 'rank', cellRenderer: (params) => i18next.t(params.value), width: 50},
                {headerName: i18next.t('Level'), field: 'level', filter: 'agNumberColumnFilter'},
                {headerName: i18next.t('Enhance'), field: 'enhance', width: 60, filter: 'agNumberColumnFilter'},
                {headerName: i18next.t('Main'), field: 'main.type', width: 100, cellRenderer: (params) => renderStat(i18next.t(params.value))},
                {headerName: i18next.t('Value'), field: 'main.value', width: 60},
                {headerName: i18next.t('Atk%'), field: 'augmentedStats.AttackPercent', cellRenderer: (params) => params.value == 0 ? "" : params.value},
                {headerName: i18next.t('Atk'), field: 'augmentedStats.Attack', cellRenderer: (params) => params.value == 0 ? "" : params.value},
                {headerName: i18next.t('Spd'), field: 'augmentedStats.Speed', cellRenderer: (params) => params.value == 0 ? "" : params.value},
                {headerName: i18next.t('Cr'), field: 'augmentedStats.CriticalHitChancePercent', cellRenderer: (params) => params.value == 0 ? "" : params.value},
                {headerName: i18next.t('Cd'), field: 'augmentedStats.CriticalHitDamagePercent', cellRenderer: (params) => params.value == 0 ? "" : params.value},
                {headerName: i18next.t('Hp%'), field: 'augmentedStats.HealthPercent', cellRenderer: (params) => params.value == 0 ? "" : params.value},
                {headerName: i18next.t('Hp'), field: 'augmentedStats.Health', cellRenderer: (params) => params.value == 0 ? "" : params.value},
                {headerName: i18next.t('Def%'), field: 'augmentedStats.DefensePercent', cellRenderer: (params) => params.value == 0 ? "" : params.value},
                {headerName: i18next.t('Def'), field: 'augmentedStats.Defense', cellRenderer: (params) => params.value == 0 ? "" : params.value},
                {headerName: i18next.t('Eff'), field: 'augmentedStats.EffectivenessPercent', cellRenderer: (params) => params.value == 0 ? "" : params.value},
                {headerName: i18next.t('Res'), field: 'augmentedStats.EffectResistancePercent', cellRenderer: (params) => params.value == 0 ? "" : params.value},
                {headerName: i18next.t('Score'), field: 'reforgedWss', width: 50, cellStyle: gearScoreBandColumnStyle},
                {headerName: i18next.t('Baili Score'), field: 'bailiScore', width: 75, cellStyle: bailiScoreBandColumnStyle, filter: 'agNumberColumnFilter'},
                {headerName: i18next.t('Baili Class'), field: 'bailiClass', width: 200},
                {headerName: i18next.t('Baili Conv Score'), field: 'bailiConvScore', width: 115, cellStyle: bailiScoreBandColumnStyle, filter: 'agNumberColumnFilter'},
                {headerName: i18next.t('Baili Conv Class'), field: 'bailiConvClass', width: 200},
                {headerName: i18next.t('Baili Conv Plan'), field: 'bailiConvPlan', width: 220},
                {headerName: i18next.t('Equipped'), field: 'equippedByName', width: 120, cellRenderer: (params) => renderStat(i18next.t(params.value))},
                // {headerName: i18next.t('Mconf'), field: 'mconfidence', width: 50},
                // {headerName: i18next.t('Material'), field: 'material', width: 120},
                {headerName: i18next.t('Locked'), field: 'locked', cellRenderer: (params) => params.value == true ? i18next.t('yes') : i18next.t('')},
                {headerName: i18next.t('noMod'), field: 'disableMods', cellRenderer: (params) => params.value == true ? i18next.t('yes') : i18next.t('')},
                // {headerName: i18next.t('Actions'), field: 'id', cellRenderer: renderActions},
                {headerName: i18next.t('Duplicate'), field: 'duplicateId', hide: true},
                {headerName: 'AllowedMods', field: 'allowedMods', hide: true},
                {headerName: 'EquippedById', field: 'equippedById', hide: true},
            ],
            rowSelection: 'multiple',
            pagination: true,
            paginationPageSize: 100000,
            localeText: localeText,
            rowData: applyBailiScoring(getAllItemsResponse.items),
            onRowSelected: onRowSelected,
            onCellMouseOver: cellMouseOver,
            onCellMouseOut: cellMouseOut,
            onCellFocused: cellFocused,
            suppressScrollOnNewData: true,
            navigateToNextCell: GridRenderer.arrowKeyNavigator(this, "itemsGrid", navigateCallback),
            animateRows: true,
            suppressDragLeaveHidesColumns: true,
            immutableData: true,
            suppressCellSelection: true,
            enableRangeSelection: false,
            isExternalFilterPresent: ItemsTab.isExternalFilterPresent,
            doesExternalFilterPass: ItemsTab.doesExternalFilterPass,
            getRowNodeId: (data) => {
                return data.id;
            },

            // onRowSelected: onRowSelected,
        };
        let gridDiv = document.getElementById('gear-grid');
        itemsGrid = new Grid(gridDiv, gridOptions);
        global.itemsGrid = itemsGrid;
        console.log("!!! itemsGrid", itemsGrid);


        Tooltip.displayItem('item1', "asdf");
        // module.exports.redraw();
    },

    getSelectedGear: () => {
        const selectedRows = itemsGrid.gridOptions.api.getSelectedRows();
        console.log("SELECTED ROWS", selectedRows)

        return selectedRows;
    },

    redraw: async (newItem) => {
        if (!itemsGrid) return;
        console.log("Redraw items", newItem);
        var selectedNode;
        const selectedNodes = itemsGrid.gridOptions.api.getSelectedNodes()
        if (selectedNodes.length == 1) {
            selectedNode = selectedNodes[0];
        }

        return Api.getAllItems().then(getAllItemsResponse => {
            const patchedItems = applyBailiScoring(getAllItemsResponse.items);
            aggregateCurrentGearStats(patchedItems);
            itemsGrid.gridOptions.api.setRowData(patchedItems)

            var refreshedItem;
            if (newItem) {
                itemsGrid.gridOptions.api.forEachNode((node) => {
                    if (node.data.id == newItem.id) {
                        node.setSelected(true, false);
                        itemsGrid.gridOptions.api.ensureNodeVisible(node);
                        refreshedItem = node.data;
                    }
                })
            } else if (selectedNode) {
                itemsGrid.gridOptions.api.forEachNode((node) => {
                    if (node.data.id == selectedNode.data.id) {
                        node.setSelected(true, false);
                        itemsGrid.gridOptions.api.ensureNodeVisible(node);
                        refreshedItem = node.data;
                    }
                })
            } else {

            }
            drawPreview(refreshedItem)
            updateSelectedCount();
        });
    },

    // refreshFilters: (setFilter, gearFilter, levelFilter, enhanceFilter, statFilter) => {
    refreshFilters: (filters) => {
        if (!itemsGrid) {
            return;
        }

        const setFilter = filters.setFilter;
        const gearFilter = filters.gearFilter;
        const levelFilter = filters.levelFilter;
        const enhanceFilter = filters.enhanceFilter;
        const statFilter = filters.statFilter;
        const substatFilter = filters.substatFilter;
        const duplicateFilter = filters.duplicateFilter;
        const equippedOrNotFilter = filters.equippedOrNotFilter;
        const modifyFilter = filters.modifyFilter;
        const bailiFilter = filters.bailiFilter;
        const bailiConvFilter = filters.bailiConvFilter;
        const gearScoreFilter = filters.gearScoreFilter;

        const setFilterComponent = itemsGrid.gridOptions.api.getFilterInstance('set');
        if (!setFilter) {
            // document.getElementById('checkboxImageClearSets').checked = true;
            setFilterComponent.setModel(null);
        } else {
            // document.getElementById('checkboxImageClearSets').checked = false;

            setFilterComponent.setModel({
                type: 'startsWith',
                filter: setFilter
            });
        }

        const gearFilterComponent = itemsGrid.gridOptions.api.getFilterInstance('gear');
        if (!gearFilter) {
            // document.getElementById('checkboxImageClearGears').checked = true;
            gearFilterComponent.setModel(null);
        } else {
            // document.getElementById('checkboxImageClearGears').checked = false;

            gearFilterComponent.setModel({
                type: 'startsWith',
                filter: gearFilter
            });
        }

        const levelFilterComponent = itemsGrid.gridOptions.api.getFilterInstance('level');
        if (!levelFilter) {
            // document.getElementById('checkboxImageClearLevels').checked = true;
            levelFilterComponent.setModel(null);
        } else {
            // document.getElementById('checkboxImageClearLevels').checked = false;

            if (levelFilter == "90") {
                levelFilterComponent.setModel({
                    type: 'equals',
                    filter: 90
                });
            }
            if (levelFilter == "88") {
                levelFilterComponent.setModel({
                    type: 'equals',
                    filter: 88
                });
            }
            if (levelFilter == "85") {
                levelFilterComponent.setModel({
                    type: 'equals',
                    filter: 85
                });
            }
            if (levelFilter == "under85") {
                levelFilterComponent.setModel({
                    type: 'lessThan',
                    filter: 85
                });
            }
            if (levelFilter == "0") {
                levelFilterComponent.setModel({
                    type: 'equals',
                    filter: 0
                });
            }
        }

        const enhanceFilterComponent = itemsGrid.gridOptions.api.getFilterInstance('enhance');
        if (!enhanceFilter) {
            enhanceFilterComponent.setModel(null);
        } else {
            if (enhanceFilter == "plus0") {
                enhanceFilterComponent.setModel({
                    filterType: 'number',
                    type: 'inRange',
                    filter: -1,
                    filterTo: 3
                });
            }
            if (enhanceFilter == "plus3") {
                enhanceFilterComponent.setModel({
                    filterType: 'number',
                    type: 'inRange',
                    filter: 2,
                    filterTo: 6
                });
            }
            if (enhanceFilter == "plus6") {
                enhanceFilterComponent.setModel({
                    filterType: 'number',
                    type: 'inRange',
                    filter: 5,
                    filterTo: 9
                });
            }
            if (enhanceFilter == "plus9") {
                enhanceFilterComponent.setModel({
                    filterType: 'number',
                    type: 'inRange',
                    filter: 8,
                    filterTo: 12
                });
            }
            if (enhanceFilter == "plus12") {
                enhanceFilterComponent.setModel({
                    filterType: 'number',
                    type: 'inRange',
                    filter: 11,
                    filterTo: 15
                });
            }
            if (enhanceFilter == "plus15") {
                enhanceFilterComponent.setModel({
                    filterType: 'number',
                    type: 'inRange',
                    filter: 14,
                    filterTo: 16
                });
            }

            // if (levelFilter == "85at") {
            //     levelFilterComponent.setModel({
            //         type: 'equals',
            //         filter: 85
            //     });
            // }
            // if (levelFilter == "85below") {
            //     levelFilterComponent.setModel({
            //         type: 'lessThan',
            //         filter: 85
            //     });
            // }
        }

        const statFilterComponent = itemsGrid.gridOptions.api.getFilterInstance('main.type');
        if (!statFilter) {
            // document.getElementById('checkboxImageClearStats').checked = true;
            statFilterComponent.setModel(null);
        } else {
            // document.getElementById('checkboxImageClearStats').checked = false;

            statFilterComponent.setModel({
                type: 'equals',
                filter: statFilter
            });
        }

        const statList = [
            "Attack",
            "AttackPercent",
            "Defense",
            "DefensePercent",
            "Health",
            "HealthPercent",
            "Speed",
            "CriticalHitChancePercent",
            "CriticalHitDamagePercent",
            "EffectivenessPercent",
            "EffectResistancePercent"
        ]
        for (var stat of statList) {
            itemsGrid.gridOptions.api.getFilterInstance('augmentedStats.' + stat).setModel(null);
        }
        if (substatFilter) {
            // const substatFilterComponent = itemsGrid.gridOptions.api.getFilterInstance('augmentedStats.' + substatFilter);

            // substatFilterComponent.setModel({
            //     type: 'notEqual',
            //     filter: 0
            // });
        }

        const allowedModsFilterComponent = itemsGrid.gridOptions.api.getFilterInstance('allowedMods');
        if (modifyFilter) {

            allowedModsFilterComponent.setModel({
                type: 'contains',
                filter: "|" + modifyFilter + "|"
            });
        } else {
            allowedModsFilterComponent.setModel(null);
        }

        const duplicateFilterComponent = itemsGrid.gridOptions.api.getFilterInstance('duplicateId');
        if (!duplicateFilter) {
            duplicateFilterComponent.setModel(null);
        } else {
            duplicateFilterComponent.setModel({
                type: 'startsWith',
                filter: "DUPLICATE"
            });
        }

        const equippedOrNotFilterComponent = itemsGrid.gridOptions.api.getFilterInstance('equippedById');
        if (!equippedOrNotFilter) {
            equippedOrNotFilterComponent.setModel(null);
        } else {
            if (equippedOrNotFilter == "equipped") {
                equippedOrNotFilterComponent.setModel({
                    type: 'contains',
                    filter: "-"
                });
            }

            if (equippedOrNotFilter == "unequipped") {
                equippedOrNotFilterComponent.setModel({
                    filterType: 'string',
                    operator: 'AND',
                    condition1: {
                        filterType: 'string',
                        type: 'notContains',
                        filter: '-'
                    },
                    condition2: {
                        filterType: 'string',
                        type: 'notContains',
                        filter: '1'
                    }


                    // type: 'notContains',
                    // filter: '-'
                });
            }
        }

        const bailiFilterComponent = itemsGrid.gridOptions.api.getFilterInstance('bailiScore');
        if (!bailiFilter) {
            bailiFilterComponent.setModel(null);
        } else if (bailiFilter == "baili0") {
            bailiFilterComponent.setModel({ type: 'equals', filter: 0 });
        } else if (bailiFilter == "baili1to3") {
            bailiFilterComponent.setModel({
                filterType: 'number',
                operator: 'AND',
                condition1: { filterType: 'number', type: 'greaterThanOrEqual', filter: 1 },
                condition2: { filterType: 'number', type: 'lessThan', filter: 4 }
            });
        } else if (bailiFilter == "baili5to9") {
            bailiFilterComponent.setModel({
                filterType: 'number',
                operator: 'AND',
                condition1: { filterType: 'number', type: 'greaterThanOrEqual', filter: 5 },
                condition2: { filterType: 'number', type: 'lessThan', filter: 10 }
            });
        } else if (bailiFilter == "baili10plus") {
            bailiFilterComponent.setModel({ type: 'greaterThanOrEqual', filter: 10 });
        }

        const bailiConvFilterComponent = itemsGrid.gridOptions.api.getFilterInstance('bailiConvScore');
        if (!bailiConvFilter) {
            bailiConvFilterComponent.setModel(null);
        } else if (bailiConvFilter == "bailiConv0") {
            bailiConvFilterComponent.setModel({ type: 'equals', filter: 0 });
        } else if (bailiConvFilter == "bailiConv1to3") {
            bailiConvFilterComponent.setModel({
                filterType: 'number',
                operator: 'AND',
                condition1: { filterType: 'number', type: 'greaterThanOrEqual', filter: 1 },
                condition2: { filterType: 'number', type: 'lessThan', filter: 4 }
            });
        } else if (bailiConvFilter == "bailiConv5to9") {
            bailiConvFilterComponent.setModel({
                filterType: 'number',
                operator: 'AND',
                condition1: { filterType: 'number', type: 'greaterThanOrEqual', filter: 5 },
                condition2: { filterType: 'number', type: 'lessThan', filter: 10 }
            });
        } else if (bailiConvFilter == "bailiConv10plus") {
            bailiConvFilterComponent.setModel({ type: 'greaterThanOrEqual', filter: 10 });
        }

        const gearScoreFilterComponent = itemsGrid.gridOptions.api.getFilterInstance('reforgedWss');
        if (!gearScoreFilter) {
            gearScoreFilterComponent.setModel(null);
        } else if (gearScoreFilter == "gsUnder70") {
            gearScoreFilterComponent.setModel({ type: 'lessThan', filter: 70 });
        } else if (gearScoreFilter == "gs70to72") {
            gearScoreFilterComponent.setModel({ filterType: 'number', type: 'inRange', filter: 70, filterTo: 73 });
        } else if (gearScoreFilter == "gs73to74") {
            gearScoreFilterComponent.setModel({ filterType: 'number', type: 'inRange', filter: 73, filterTo: 75 });
        } else if (gearScoreFilter == "gs75plus") {
            gearScoreFilterComponent.setModel({ type: 'greaterThanOrEqual', filter: 75 });
        }

        itemsGrid.gridOptions.api.onFilterChanged();
        updateSelectedCount();
    }
}
            // SAMPLE OR FILTER
            // statFilterComponent.setModel({
            //     // filterType: 'string',
            //     // operator: 'OR',
            //     // condition1: {
            //     //     filterType: 'string',
            //     //     type: 'notEqual',
            //     //     filter: modifyFilter
            //     // },
            //     // condition2: {
            //     //     filterType: 'string',
            //     //     type: 'equals',
            //     //     filter: 6
            //     // }
            //     type: 'notEqual',
            //     filter: modifyFilter
            // });

function renderActions(params) {
    const id = params.value;
    return '<img class="optimizerSetIcon" id="item1" src=' + Assets.getSetAsset("SpeedSet") + '></img>';
}

function columnGradient(params) {
    try {
        // if (!params || params.value == undefined) return;
        var colId = params.column.colId;
        var value = params.value;

        var agg = currentAggregate[colId];
        if (!agg) return;

        var percent = (value) / (agg.max + 1);
        const color = gradient.gradient.rgbAt(percent);

        if (percent == 0) {
            return {
                backgroundColor: 'ffffff00'
            }
        }

        return {
            backgroundColor: color.toHexString()
        };
    } catch (e) {console.error(e)}

}

function scoreColumnGradient(params) {
    try {
        if (!params || params.value == undefined) return;
        var colId = params.column.colId;
        var value = params.value;

        // var percent = value * (80-40) + 0.4;
        var percent = (80 * (value/80))/100
        percent = Math.min(1, percent);
        percent = Math.max(0, percent);

        const color = scoreGradient.gradient.rgbAt(percent);

        return {
            backgroundColor: color.toHexString()
        };
    } catch (e) {console.error(e)}
}

function bailiScoreBandColumnStyle(params) {
    try {
        if (!params || params.value == undefined) return;
        const value = Number(params.value) || 0;

        // Baili ranges: 0, 1-3, 5-9, 10+
        if (value >= 10) return { backgroundColor: '#58D9F9' };
        if (value >= 5) return { backgroundColor: '#7CFFB2' };
        if (value >= 1) return { backgroundColor: '#FDDD60' };
        return { backgroundColor: '#FF6E76' };
    } catch (e) { console.error(e) }
}

function gearScoreBandColumnStyle(params) {
    try {
        if (!params || params.value == undefined) return;
        const value = Number(params.value) || 0;

        // Gear score ranges: <70, 70-72, 73-74, 75+
        if (value >= 75) return { backgroundColor: '#58D9F9' };
        if (value >= 73) return { backgroundColor: '#7CFFB2' };
        if (value >= 70) return { backgroundColor: '#FDDD60' };
        return { backgroundColor: '#FF6E76' };
    } catch (e) { console.error(e) }
}

function aggregateCurrentGearStats(items) {
    console.log("Aggregating", items)
    const statsToAggregate = [
        "augmentedStats.AttackPercent",
        "augmentedStats.Attack",
        "augmentedStats.Speed",
        "augmentedStats.CriticalHitChancePercent",
        "augmentedStats.CriticalHitDamagePercent",
        "augmentedStats.HealthPercent",
        "augmentedStats.Health",
        "augmentedStats.DefensePercent",
        "augmentedStats.Defense",
        "augmentedStats.EffectivenessPercent",
        "augmentedStats.EffectResistancePercent"
    ]

    var count = items.length;

    for (var stat of statsToAggregate) {
        const arrSum = arr => arr.reduce((a, b) => a + b.augmentedStats[stat.split(".")[1]], 0);

        var max = Math.max(...getField(items, stat));
        var sum = arrSum(items);
        var avg = sum/count;

        currentAggregate[stat] = {
            max,
            sum,
            avg
        }
    }

    console.log("Aggregated", currentAggregate)
}

function getField(items, stat) {
    return items.map(x => x.augmentedStats[stat.split(".")[1]]);
}

function applyBailiScoring(items) {
    return (items || []).map(item => {
        const baili = calculateBailiScore(item);
        item.bailiScore = Number(baili.score) || 0;
        item.bailiClass = baili.bailiClass;
        const conv = calculateBestBailiConversion(item, baili);
        item.bailiConvScore = Number(conv.score) || 0;
        item.bailiConvClass = conv.bailiClass;
        item.bailiConvPlan = conv.plan;
        return item;
    });
}

function calculateBailiScore(item) {
    const gearScore = item.reforgedWss || item.wss || 0;
    const stats = item.reforgedStats || item.augmentedStats || {};
    const speed = stats.Speed || 0;

    // Main categories are mutually exclusive; use first match in order.
    let mainScore = 0;
    let bailiClass = "未分类";
    if (matchShuchu(item, stats)) {
        mainScore = shuchuScore(item, getEffectiveGearScore(stats, SHUCHU_EFFECTIVE_STATS));
        bailiClass = "输出";
    } else if (matchShuchuBiba(item, stats)) {
        mainScore = shuchuBibaScore(item, getEffectiveGearScore(stats, SHUCHU_BIBAO_EFFECTIVE_STATS));
        bailiClass = "输出（必爆）";
    } else if (matchKangtan(item, stats)) {
        mainScore = kangtanScore(item, getEffectiveGearScore(stats, KANGTAN_EFFECTIVE_STATS));
        bailiClass = "抗坦";
    } else if (matchChunrou(item, stats)) {
        mainScore = chunrouScore(item, getEffectiveGearScore(stats, CHUNROU_EFFECTIVE_STATS));
        bailiClass = "纯肉";
    } else if (matchMingtan(item, stats)) {
        mainScore = mingtanScore(item, getEffectiveGearScore(stats, MINGTAN_EFFECTIVE_STATS));
        bailiClass = "命坦";
    } else if (matchShuangxiao(item, stats)) {
        mainScore = shuangxiaoScore(item, getEffectiveGearScore(stats, SHUANGXIAO_EFFECTIVE_STATS));
        bailiClass = "双效";
    } else if (matchBanrouXuefang(item, stats)) {
        mainScore = banrouXuefangScore(item, getEffectiveGearScore(stats, BANROU_XUEFANG_EFFECTIVE_STATS));
        bailiClass = "半肉（血防）";
    } else if (matchBanrou(item, stats)) {
        mainScore = banrouScore(item, getEffectiveGearScore(stats, BANROU_EFFECTIVE_STATS));
        bailiClass = "半肉";
    } else if (matchBanrouBaizi(item, stats)) {
        mainScore = banrouBaiziScore(item, getEffectiveGearScore(stats, BANROU_BAIZI_EFFECTIVE_STATS));
        bailiClass = "半肉（白字）";
    } else if (gearScore >= 75) {
        mainScore = Math.max(0, (2.0 / 3.0) * (gearScore - 73.5));
        bailiClass = "未来可期";
    }

    // One-speed and speed scores are special bonuses and can be stacked.
    let bonusScore = 0;
    const bonusTags = [];
    if (matchYisu(item, speed)) {
        bonusScore += yisuScore(speed);
        bonusTags.push("一速");
    }
    if (matchSudu(item, speed)) {
        bonusScore += suduScore(item, getEffectiveGearScore(stats, SUDU_EFFECTIVE_STATS), speed);
        bonusTags.push("速度");
    }

    const score = Math.max(0, Utils.round10ths(mainScore + bonusScore));
    const classText = bonusTags.length > 0
        ? `${bailiClass} + ${bonusTags.join(" + ")}`
        : bailiClass;
    return {
        score: score,
        bailiClass: classText
    };
}

const CONVERTIBLE_STATS_BY_GEAR = {
    Weapon: [
        "AttackPercent", "Health", "HealthPercent", "Speed",
        "CriticalHitChancePercent", "CriticalHitDamagePercent",
        "EffectivenessPercent", "EffectResistancePercent"
    ],
    Helmet: [
        "Attack", "AttackPercent", "Defense", "DefensePercent", "HealthPercent", "Speed",
        "CriticalHitChancePercent", "CriticalHitDamagePercent", "EffectivenessPercent", "EffectResistancePercent"
    ],
    Armor: [
        "DefensePercent", "Health", "HealthPercent", "Speed",
        "CriticalHitChancePercent", "CriticalHitDamagePercent", "EffectivenessPercent", "EffectResistancePercent"
    ],
    Necklace: [
        "Attack", "AttackPercent", "Defense", "DefensePercent", "Health", "HealthPercent", "Speed",
        "CriticalHitChancePercent", "CriticalHitDamagePercent", "EffectivenessPercent", "EffectResistancePercent"
    ],
    Ring: [
        "Attack", "AttackPercent", "Defense", "DefensePercent", "Health", "HealthPercent", "Speed",
        "CriticalHitChancePercent", "CriticalHitDamagePercent", "EffectivenessPercent", "EffectResistancePercent"
    ],
    Boots: [
        "Attack", "AttackPercent", "Defense", "DefensePercent", "Health", "HealthPercent", "Speed",
        "CriticalHitChancePercent", "CriticalHitDamagePercent", "EffectivenessPercent", "EffectResistancePercent"
    ]
};

function calculateBestBailiConversion(item, currentBaili) {
    const substats = item.substats || [];
    let best = {
        score: currentBaili.score,
        bailiClass: currentBaili.bailiClass,
        plan: "No conversion",
    };

    for (let i = 0; i < substats.length; i++) {
        const baseSub = substats[i];
        if (!baseSub) continue;

        const candidates = getConversionCandidates(item, i);
        for (const replacementStat of candidates) {
            const convertedValue = getBestConvertibleValue(item, replacementStat, baseSub.rolls || 1);
            if (convertedValue == null) continue;

            const itemCopy = JSON.parse(JSON.stringify(item));
            const copySub = itemCopy.substats[i];
            const originalType = copySub.type;
            const originalAugValue = copySub.value || 0;
            const originalReforgedValue = copySub.reforgedValue || copySub.value || 0;

            copySub.type = replacementStat;
            copySub.value = convertedValue;
            copySub.reforgedValue = convertedValue;
            copySub.modified = true;

            if (itemCopy.augmentedStats) {
                itemCopy.augmentedStats[originalType] = Math.max(0, (itemCopy.augmentedStats[originalType] || 0) - originalAugValue);
                itemCopy.augmentedStats[replacementStat] = (itemCopy.augmentedStats[replacementStat] || 0) + convertedValue;
            }
            if (itemCopy.reforgedStats) {
                itemCopy.reforgedStats[originalType] = Math.max(0, (itemCopy.reforgedStats[originalType] || 0) - originalReforgedValue);
                itemCopy.reforgedStats[replacementStat] = (itemCopy.reforgedStats[replacementStat] || 0) + convertedValue;
            }

            const baili = calculateBailiScore(itemCopy);
            if (baili.score > best.score) {
                best = {
                    score: baili.score,
                    bailiClass: baili.bailiClass,
                    plan: `${i18next.t(originalType)} -> ${i18next.t(replacementStat)} (${convertedValue})`,
                };
            }
        }
    }
    return best;
}

function getConversionCandidates(item, replaceIndex) {
    const allCandidates = CONVERTIBLE_STATS_BY_GEAR[item.gear] || [];
    const existingSubstats = (item.substats || []).map(s => s.type);
    const replaceStat = item.substats?.[replaceIndex]?.type;

    return allCandidates.filter(stat => {
        if (stat == item.main.type) return false;
        if (item.gear == "Weapon" && stat.includes("Defense")) return false;
        if (item.gear == "Armor" && stat.includes("Attack")) return false;
        if (stat != replaceStat && existingSubstats.includes(stat)) return false;
        return true;
    });
}

function getBestConvertibleValue(item, statType, rolls) {
    const reforged = (Reforge.isReforgeable(item) || item.level == 90) ? "reforged" : "unreforged";
    const modTier = "greater";
    const rollIndex = Math.max(0, Math.min(5, (rolls || 1) - 1));

    const values = Constants?.modValues?.[reforged]?.[modTier]?.[statType]?.[rollIndex];
    if (!values || values.length < 2) {
        return null;
    }
    return values[1];
}

function evaluatePiecewise(score, rules) {
    for (const rule of rules) {
        if (rule.when(score)) {
            return Math.max(0, Utils.round10ths(rule.value(score)));
        }
    }
    return 0;
}

const WSS_WEIGHTS = {
    AttackPercent: 1,
    DefensePercent: 1,
    HealthPercent: 1,
    EffectResistancePercent: 1,
    EffectivenessPercent: 1,
    Speed: (8.0 / 4.0),
    CriticalHitDamagePercent: (8.0 / 7.0),
    CriticalHitChancePercent: (8.0 / 5.0),
    Attack: (3.46 / 39),
    Defense: (4.99 / 31),
    Health: (3.09 / 174),
};

// Baili v5 rule interpretation notes (Chinese rule text -> internal enums):
// - 效果命中 == 效命 == 命中 -> EffectivenessPercent
// - 效果抗性 == 效抗 == 抗性 -> EffectResistancePercent
// - 生命套 == 血套 -> HealthSet
// - 防御套 == 防套 -> DefenseSet
// - 攻击套 == 攻套 -> AttackSet
// - 爆率 == 暴率 -> CriticalHitChancePercent
// - 爆伤 == 暴伤 == 破灭 -> CriticalHitDamagePercent / DestructionSet (set context)
// - 贯穿 == 穿透 -> PenetrationSet
// - 双爆 -> either Crit Chance OR Crit Damage (not both required)
const SHUCHU_EFFECTIVE_STATS = ["AttackPercent", "Attack", "CriticalHitChancePercent", "CriticalHitDamagePercent", "Speed"];
const SHUCHU_BIBAO_EFFECTIVE_STATS = ["AttackPercent", "Attack", "CriticalHitDamagePercent", "Speed"];
const KANGTAN_EFFECTIVE_STATS = ["HealthPercent", "Health", "DefensePercent", "Defense", "Speed", "EffectResistancePercent"];
const CHUNROU_EFFECTIVE_STATS = ["HealthPercent", "Health", "DefensePercent", "Defense", "Speed"];
const MINGTAN_EFFECTIVE_STATS = ["HealthPercent", "Health", "DefensePercent", "Defense", "Speed", "EffectivenessPercent"];
const SHUANGXIAO_EFFECTIVE_STATS = ["Speed", "HealthPercent", "DefensePercent", "Defense", "EffectResistancePercent", "EffectivenessPercent", "AttackPercent"];
const BANROU_XUEFANG_EFFECTIVE_STATS = ["CriticalHitChancePercent", "CriticalHitDamagePercent", "Speed", "HealthPercent", "DefensePercent", "Defense"];
const BANROU_EFFECTIVE_STATS = ["AttackPercent", "CriticalHitChancePercent", "CriticalHitDamagePercent", "Speed", "HealthPercent", "DefensePercent", "Defense"];
const BANROU_BAIZI_EFFECTIVE_STATS = ["AttackPercent", "Attack", "Speed", "HealthPercent", "Health", "DefensePercent", "Defense"];
const SUDU_EFFECTIVE_STATS = ["Speed"];

function getEffectiveGearScore(stats, effectiveStats) {
    let score = 0;
    for (const stat of effectiveStats) {
        const value = stats[stat] || 0;
        const weight = WSS_WEIGHTS[stat] || 0;
        score += value * weight;
    }
    return Utils.round10ths(score);
}

function hasAnyStat(stats, names) {
    return names.some(name => (stats[name] || 0) > 0);
}

function hasDualCrit(stats) {
    return hasStat(stats, "CriticalHitChancePercent") || hasStat(stats, "CriticalHitDamagePercent");
}

function hasStat(stats, name) {
    return (stats[name] || 0) > 0;
}

function isNonBoots(item) {
    return item.gear != "Boots";
}

function matchMain(item, allowedMains) {
    if (!allowedMains || allowedMains.length == 0) {
        return true;
    }
    return allowedMains.includes(item.main.type);
}

function matchSet(item, allowedSets) {
    if (!allowedSets || allowedSets.length == 0) {
        return true;
    }
    return allowedSets.includes(item.set);
}

function matchYisu(item, speed) {
    return isNonBoots(item) && hasSpeedMainOrSub(item) && speed >= 22;
}

function yisuScore(speed) {
    return evaluatePiecewise(speed, [
        { when: s => s >= 27, value: s => 20 * s - 490 },
        { when: s => s >= 25, value: s => 10 * s - 225 },
        { when: s => s >= 22, value: s => 5 * s - 105 },
        { when: _ => true, value: _ => 0 },
    ]);
}

function hasSpeedMainOrSub(item) {
    if (item.main && item.main.type == "Speed") {
        return true;
    }
    const substats = item.substats || [];
    return substats.some(s => s.type == "Speed");
}

function matchSudu(item, speed) {
    if (!isNonBoots(item)) {
        return false;
    }
    if (speed < 18) {
        return false;
    }
    const speedSet = item.set == "SpeedSet";
    const nonSpeedSets = [
        "CriticalSet", "HealthSet", "DefenseSet", "ImmunitySet",
        "PenetrationSet", "TorrentSet", "HitSet", "ResistSet"
    ];
    return speedSet || nonSpeedSets.includes(item.set);
}

function suduScore(item, score, speed) {
    if (speed < 18) {
        return 0;
    }
    if (item.set == "SpeedSet") {
        return evaluatePiecewise(score, [
            { when: s => s >= 78, value: s => 4 * s - 285 },
            { when: s => s >= 73, value: s => 3 * s - 207 },
            { when: s => s >= 68, value: s => 2 * s - 134 },
            { when: _ => true, value: _ => 0 },
        ]);
    }
    return evaluatePiecewise(score, [
        { when: s => s >= 75, value: s => s - 69 },
        { when: s => s >= 70, value: s => 0.8 * (s - 67.5) },
        { when: s => s >= 70, value: _ => 4.0 },
        { when: _ => true, value: _ => 0 },
    ]);
}

function matchShuchu(item, stats) {
    const sets = ["SpeedSet", "DestructionSet", "CriticalSet", "PenetrationSet", "TorrentSet", "CounterSet", "LifestealSet", "ImmunitySet", "RiposteSet", "WarfareSet"];
    const mainByGear = {
        Necklace: ["CriticalHitChancePercent", "CriticalHitDamagePercent"],
        Ring: ["AttackPercent"],
        Boots: ["Speed", "AttackPercent"],
    };
    // Explicitly keep "双爆" semantics as OR when applicable.
    const hasOutputStats = hasAnyStat(stats, SHUCHU_EFFECTIVE_STATS);
    const hasDoubleCrit = hasDualCrit(stats);
    return matchSet(item, sets) && hasOutputStats && (hasDoubleCrit || hasAnyStat(stats, ["AttackPercent", "Attack", "Speed"])) && matchMain(item, mainByGear[item.gear] || []);
}

function shuchuScore(item, score) {
    if (item.gear == "Weapon" || item.gear == "Helmet") {
        return evaluatePiecewise(score, [
            { when: s => s >= 78, value: s => 3 * s - 220 },
            { when: s => s >= 75, value: s => 2 * s - 142 },
            { when: s => s >= 70, value: s => 1.4 * s - 97 },
            { when: s => s >= 67, value: _ => 0 },
            { when: _ => true, value: _ => 0 },
        ]);
    }
    if (item.gear == "Armor") {
        return evaluatePiecewise(score, [
            { when: s => s >= 73, value: s => 3 * s - 203 },
            { when: s => s >= 69, value: s => 2 * s - 130 },
            { when: s => s >= 64, value: s => 1.4 * s - 88.6 },
            { when: s => s >= 61, value: _ => 0 },
            { when: _ => true, value: _ => 0 },
        ]);
    }
    if (item.gear == "Necklace" || item.gear == "Ring") {
        return evaluatePiecewise(score, [
            { when: s => s >= 74, value: s => 4 * s - 280 },
            { when: s => s >= 71, value: s => 2.5 * s - 169 },
            { when: s => s >= 66, value: s => 1.5 * s - 98 },
            { when: s => s >= 63, value: _ => 0 },
            { when: _ => true, value: _ => 0 },
        ]);
    }
    if (item.gear == "Boots") {
        return evaluatePiecewise(score, [
            { when: s => s >= 74, value: s => 4 * s - 277.5 },
            { when: s => s >= 71, value: s => 2.5 * s - 166.5 },
            { when: s => s >= 65, value: s => 1.5 * s - 95.5 },
            { when: s => s >= 62, value: _ => 0 },
            { when: _ => true, value: _ => 0 },
        ]);
    }
    return 0;
}

function matchShuchuBiba(item, stats) {
    const sets = ["SpeedSet", "DestructionSet", "PenetrationSet", "TorrentSet", "ImmunitySet", "RiposteSet"];
    const mainByGear = {
        Necklace: ["CriticalHitDamagePercent"],
        Ring: ["AttackPercent"],
        Boots: ["Speed", "AttackPercent"],
    };
    return matchSet(item, sets) && hasAnyStat(stats, SHUCHU_BIBAO_EFFECTIVE_STATS) && item.gear != "Armor" && matchMain(item, mainByGear[item.gear] || []);
}

function shuchuBibaScore(item, score) {
    if (item.gear == "Armor") {
        return 0;
    }
    if (item.gear == "Weapon") {
        return evaluatePiecewise(score, [
            { when: s => s >= 72, value: s => 5 * s - 340.5 },
            { when: s => s >= 68, value: s => 2.5 * s - 160.5 },
            { when: s => s >= 63, value: s => 1.5 * s - 92.5 },
            { when: s => s >= 60, value: _ => 0 },
            { when: _ => true, value: _ => 0 },
        ]);
    }
    if (item.gear == "Helmet") {
        return evaluatePiecewise(score, [
            { when: s => s >= 75, value: s => 5 * s - 355.5 },
            { when: s => s >= 71, value: s => 2.5 * s - 168 },
            { when: s => s >= 66, value: s => 1.5 * s - 97 },
            { when: s => s >= 63, value: _ => 0 },
            { when: _ => true, value: _ => 0 },
        ]);
    }
    return evaluatePiecewise(score, [
        { when: s => s >= 66, value: s => 5 * s - 310.5 },
        { when: s => s >= 63, value: s => 3 * s - 178.5 },
        { when: s => s >= 59, value: s => 2 * s - 115.5 },
        { when: s => s >= 56, value: _ => 0 },
        { when: _ => true, value: _ => 0 },
    ]);
}

function matchKangtan(item, stats) {
    const sets = ["SpeedSet", "HealthSet", "DefenseSet", "ResistSet", "ProtectionSet", "CounterSet", "ImmunitySet", "ReversalSet", "WarfareSet", "PursuitSet"];
    const mainByGear = {
        Necklace: ["HealthPercent", "DefensePercent"],
        Ring: ["HealthPercent", "DefensePercent", "EffectResistancePercent"],
        Boots: ["HealthPercent", "DefensePercent", "Speed"],
    };
    return matchSet(item, sets) && hasAnyStat(stats, KANGTAN_EFFECTIVE_STATS) && matchMain(item, mainByGear[item.gear] || []);
}

function kangtanScore(item, score) {
    if (item.gear == "Weapon") {
        return evaluatePiecewise(score, [
            { when: s => s >= 74, value: s => 3 * s - 204 },
            { when: s => s >= 70, value: s => 2 * s - 130 },
            { when: s => s >= 64, value: s => 1.5 * s - 95 },
            { when: s => s >= 61, value: _ => 0 },
            { when: _ => true, value: _ => 0 },
        ]);
    }
    if (item.gear == "Helmet" || item.gear == "Armor") {
        return evaluatePiecewise(score, [
            { when: s => s >= 79, value: s => 3 * s - 221 },
            { when: s => s >= 76, value: s => 2 * s - 142 },
            { when: s => s >= 70, value: s => 1.5 * s - 104 },
            { when: s => s >= 67, value: _ => 0 },
            { when: _ => true, value: _ => 0 },
        ]);
    }
    return evaluatePiecewise(score, [
        { when: s => s >= 74, value: s => 3 * s - 203 },
        { when: s => s >= 70, value: s => 2 * s - 129 },
        { when: s => s >= 64, value: s => 1.5 * s - 94 },
        { when: s => s >= 61, value: _ => 0 },
        { when: _ => true, value: _ => 0 },
    ]);
}

function matchChunrou(item, stats) {
    const sets = ["SpeedSet", "HealthSet", "DefenseSet", "ProtectionSet", "ImmunitySet", "ReversalSet", "WarfareSet"];
    const mainByGear = {
        Necklace: ["HealthPercent"],
        Ring: ["HealthPercent"],
        Boots: ["HealthPercent", "Speed"],
    };
    return matchSet(item, sets) && hasAnyStat(stats, CHUNROU_EFFECTIVE_STATS) && matchMain(item, mainByGear[item.gear] || []);
}

function chunrouScore(item, score) {
    if (item.gear == "Weapon") {
        return 0;
    }
    if (item.gear == "Helmet" || item.gear == "Armor") {
        return evaluatePiecewise(score, [
            { when: s => s >= 74, value: s => 3.5 * s - 237 },
            { when: s => s >= 68, value: s => 2 * s - 126 },
            { when: s => s >= 63, value: s => 1.8 * s - 112.4 },
            { when: _ => true, value: _ => 0 },
        ]);
    }
    if (item.gear == "Necklace") {
        return evaluatePiecewise(score, [
            { when: s => s >= 70, value: s => 5 * s - 321 },
            { when: s => s >= 64, value: s => 3 * s - 181 },
            { when: s => s >= 58, value: s => 1.5 * s - 85 },
            { when: _ => true, value: _ => 0 },
        ]);
    }
    return evaluatePiecewise(score, [
        { when: s => s >= 68, value: s => 5 * s - 319 },
        { when: s => s >= 64, value: s => 2.5 * s - 149 },
        { when: s => s >= 58, value: s => 1.5 * s - 85 },
        { when: _ => true, value: _ => 0 },
    ]);
}

function matchMingtan(item, stats) {
    const sets = ["SpeedSet", "HealthSet", "DefenseSet", "HitSet", "ImmunitySet", "PursuitSet"];
    const mainByGear = {
        Necklace: ["HealthPercent", "DefensePercent"],
        Ring: ["HealthPercent", "DefensePercent", "EffectivenessPercent"],
        Boots: ["Speed"],
    };
    return matchSet(item, sets) && hasAnyStat(stats, MINGTAN_EFFECTIVE_STATS) && matchMain(item, mainByGear[item.gear] || []);
}

function mingtanScore(item, score) {
    return kangtanScore(item, score);
}

function matchShuangxiao(item, stats) {
    const sets = ["SpeedSet", "HealthSet", "DefenseSet", "HitSet", "ResistSet", "CounterSet", "ImmunitySet"];
    const hasEffOrRes = hasStat(stats, "EffectivenessPercent") || hasStat(stats, "EffectResistancePercent");
    const atkWithBoth = hasStat(stats, "AttackPercent") && hasEffOrRes;
    const mainByGear = {
        Necklace: ["HealthPercent", "DefensePercent", "AttackPercent"],
        Ring: ["HealthPercent", "DefensePercent", "AttackPercent", "EffectResistancePercent", "EffectivenessPercent"],
        Boots: ["Speed"],
    };
    return matchSet(item, sets) && hasAnyStat(stats, SHUANGXIAO_EFFECTIVE_STATS) && hasEffOrRes && !atkWithBoth && matchMain(item, mainByGear[item.gear] || []);
}

function shuangxiaoScore(_item, score) {
    return evaluatePiecewise(score, [
        { when: s => s >= 75, value: s => 2 * s - 146 },
        { when: s => s >= 72, value: s => s - 71 },
        { when: s => s >= 69, value: _ => 0 },
        { when: _ => true, value: _ => 0 },
    ]);
}

function matchBanrouXuefang(item, stats) {
    const sets = ["HealthSet", "DefenseSet", "SpeedSet", "DestructionSet", "CounterSet", "InjurySet", "ImmunitySet", "PenetrationSet", "PursuitSet"];
    const mainByGear = {
        Necklace: ["CriticalHitChancePercent", "CriticalHitDamagePercent"],
        Ring: ["HealthPercent", "DefensePercent"],
        Boots: ["Speed"],
    };
    return matchSet(item, sets) && hasAnyStat(stats, BANROU_XUEFANG_EFFECTIVE_STATS) && matchMain(item, mainByGear[item.gear] || []);
}

function banrouXuefangScore(item, score) {
    if (item.gear == "Weapon" || item.gear == "Helmet" || item.gear == "Armor") {
        return evaluatePiecewise(score, [
            { when: s => s >= 77, value: s => 3 * s - 221 },
            { when: s => s >= 74, value: s => 2 * s - 144 },
            { when: s => s >= 71, value: s => s - 70 },
            { when: s => s >= 68, value: _ => 0 },
            { when: _ => true, value: _ => 0 },
        ]);
    }
    if (item.gear == "Necklace" || item.gear == "Ring") {
        return evaluatePiecewise(score, [
            { when: s => s >= 77, value: s => 4 * s - 295 },
            { when: s => s >= 74, value: s => 2 * s - 141 },
            { when: s => s >= 68, value: s => s - 67 },
            { when: s => s >= 65, value: _ => 0 },
            { when: _ => true, value: _ => 0 },
        ]);
    }
    return evaluatePiecewise(score, [
        { when: s => s >= 77, value: s => 4 * s - 295 },
        { when: s => s >= 74, value: s => 2 * s - 141 },
        { when: s => s >= 68, value: s => s - 67 },
        { when: s => s >= 65, value: _ => 0 },
        { when: _ => true, value: _ => 0 },
    ]);
}

function matchBanrou(item, stats) {
    const sets = ["HealthSet", "DefenseSet", "SpeedSet", "CriticalSet", "DestructionSet", "CounterSet", "InjurySet", "LifestealSet", "ImmunitySet", "PenetrationSet", "RiposteSet"];
    const mainByGear = {
        Necklace: ["CriticalHitChancePercent", "CriticalHitDamagePercent"],
        Ring: ["HealthPercent", "DefensePercent", "AttackPercent"],
        Boots: ["Speed"],
    };
    return matchSet(item, sets) && hasAnyStat(stats, BANROU_EFFECTIVE_STATS) && matchMain(item, mainByGear[item.gear] || []);
}

function banrouScore(_item, score) {
    return evaluatePiecewise(score, [
        { when: s => s >= 75, value: s => 2 * s - 146 },
        { when: s => s >= 72, value: s => s - 71 },
        { when: s => s >= 69, value: _ => 0 },
        { when: _ => true, value: _ => 0 },
    ]);
}

function matchBanrouBaizi(item, stats) {
    const sets = ["HealthSet", "DefenseSet", "SpeedSet", "CounterSet", "ImmunitySet", "WarfareSet", "PursuitSet"];
    const mainByGear = {
        Necklace: ["DefensePercent", "HealthPercent", "AttackPercent"],
        Ring: ["HealthPercent", "DefensePercent", "AttackPercent"],
        Boots: ["Speed"],
    };
    return matchSet(item, sets) && hasAnyStat(stats, BANROU_BAIZI_EFFECTIVE_STATS) && matchMain(item, mainByGear[item.gear] || []);
}

function banrouBaiziScore(item, score) {
    if (item.gear == "Helmet") {
        return evaluatePiecewise(score, [
            { when: s => s >= 79, value: s => 3 * s - 221 },
            { when: s => s >= 76, value: s => 2 * s - 142 },
            { when: s => s >= 71, value: s => 1.5 * s - 104 },
            { when: s => s >= 68, value: _ => 0 },
            { when: _ => true, value: _ => 0 },
        ]);
    }
    if (item.gear == "Weapon" || item.gear == "Armor") {
        return evaluatePiecewise(score, [
            { when: s => s >= 74, value: s => 3 * s - 204 },
            { when: s => s >= 70, value: s => 2 * s - 130 },
            { when: s => s >= 65, value: s => 1.5 * s - 95 },
            { when: s => s >= 62, value: _ => 0 },
            { when: _ => true, value: _ => 0 },
        ]);
    }
    return evaluatePiecewise(score, [
        { when: s => s >= 74, value: s => 4 * s - 280 },
        { when: s => s >= 71, value: s => 2.5 * s - 169 },
        { when: s => s >= 67, value: s => 1.5 * s - 98 },
        { when: s => s >= 64, value: _ => 0 },
        { when: _ => true, value: _ => 0 },
    ]);
}

function renderSets(name) {
    return '<img class="optimizerSetIcon" src=' + Assets.getSetAsset(name) + '></img>'
}

function renderGear(name) {
    return '<img class="optimizerSetIcon" src=' + Assets.getGearAsset(name) + '></img>'
}

function renderStat(name) {
    const statEdits = {
        "CriticalHitDamagePercent": "Crit Dmg %",
        "CriticalHitChancePercent": "Crit Chance %",
        "EffectivenessPercent": "Effectiveness %",
        "EffectResistancePercent": "Effect Resist %",
        "AttackPercent": "Attack %",
        "HealthPercent": "Health %",
        "DefensePercent": "Defense %",
    };

    return statEdits[name] || name;
}

function updateSelectedCount() {
    const count = module.exports.getSelectedGear().length;
    $('#selectedCount').html(count);
}

function navigateCallback(selectedNode) {
    // console.log("callback", selectedNode);

    if (!selectedNode) return;
    const item = selectedNode.data;
    selectedCell = item;

    drawPreview(item);
}

function cellFocused(event) {

}

async function cellMouseOver(event) {
    const item = event.data;

    await drawPreview(item);
}

async function cellMouseOut(event) {
    if (!selectedCell) return;
    // console.log("out", event);

    await drawPreview(selectedCell);
}

async function drawPreview(item) {
    if (!item) {
        document.getElementById("gearTabPreview").innerHTML = "";
        return;
    }

    var baseStats = null;

    if (!item.equippedByName) {

    } else {
        // baseStats = (await Api.getHeroById(item.equippedById, true)).baseStats;
        baseStats = HeroData.getBaseStatsByStars(item.equippedByName, true, 6);
    }

    // TODO ADD STAT SELECTOR
    const html = HtmlGenerator.buildItemPanel(item, "itemsGrid", baseStats, "Speed")
    document.getElementById("gearTabPreview").innerHTML = html
}

function onRowSelected(event) {
    if (event.node.selected) {
        selectedCell = event.data;
        updateSelectedCount();

        // Testing purposes
        // Reforge.calculateMaxes(event.data);
        Reforge.unreforgeItem(event.data);
        console.log(event.data);
        // GearRating.rate(event.data);
    }
}
