
var select_layer_names = [];
var multi_text = '';
executeSelectLayersAction(function (layer) {
    if (layer.kind == LayerKind.TEXT) {
        multi_text += layer.textItem.contents.replace(/\r/g,'<br>')+'\n';
    } else {
        alert('選択したレイヤーはテキストレイヤーではないようです');
    }
});
copyTextToClipboard(multi_text);

function copyTextToClipboard(text) {
    const keyTextData = app.charIDToTypeID('TxtD');
    const keyTextToClipboardStr = app.stringIDToTypeID("textToClipboard");
    var textStrDesc = new ActionDescriptor();
    textStrDesc.putString(keyTextData, text);
    executeAction(keyTextToClipboardStr, textStrDesc, DialogModes.NO);
}


function executeSelectLayersAction(exec_action) {
    // 元のactiveLayer位置を覚えておく
    var active_layer = app.activeDocument.activeLayer;
    var is_visible = active_layer.visible;

    var doc_ref = new ActionReference()
    doc_ref.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    var target_layers = executeActionGet(doc_ref).getList(stringIDToTypeID('targetLayersIndexes'));

    // 選択しているレイヤーのIDを取得しておく
    for (var i = 0; i < target_layers.count; i++) {
        var index = target_layers.getReference(i).getIndex() + 1;

        // レイヤーを選択状態にする
        var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putIndex(charIDToTypeID("Lyr "), index);
        desc.putReference(charIDToTypeID("null"), ref);
        desc.putBoolean(charIDToTypeID("MkVs"), false);
        executeAction(charIDToTypeID("slct"), desc, DialogModes.NO);

        var select_layer = app.activeDocument.activeLayer;
        exec_action(select_layer);
    }

    app.activeDocument.activeLayer = active_layer;
    app.activeDocument.activeLayer.visible = is_visible;
}