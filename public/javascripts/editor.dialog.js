(function(global) {

  var EditorDialog = function() {
    var $body = $('body');
    this.$win =$([
      '<div id="edit-dialog-modal" class="modal fade">',
        '<div class="modal-dialog">',
          '<div class="modal-content">',
            '<div class="modal-header">',
              '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
              '<h4 class="modal-title"></h4>',
            '</div>',
            '<div class="modal-body">',
              '<div class="comment-reply-input">',
                '<div class="markdown_editor in_editor">',
                  '<div class="markdown_in_editor">',
                    '<textarea class="span8 editor" rows="4"></textarea>',
                  '</div>',
                '</div>',
              '</div>',
            '</div>',
            '<div class="modal-footer">',
              '<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>',
              '<button type="button" class="btn btn-primary" role="submit">提交</button>',
            '</div>',
          '</div>',
        '</div>',
      '</div>'].join('')).appendTo($body);

    // dialog消失时，移除嵌入到body内的modal
    this.$win.on('hidden.bs.modal', function (e) {
      $('#edit-dialog-modal').remove();
    });
  };

  EditorDialog.prototype.init = function (title, content) {
    this.title = title;
    this.content = content;
  };

  EditorDialog.prototype.show = function(callback){
    var that = this;
    that.$win.find('.modal-title').text(that.title);
    // 构建编辑器
    that.editor = new Editor();
    that.editor.render(this.$win.find('.editor')[0]);
    that.$win.modal('show');
    that.editor.codemirror.focus();
    that.editor.push(this.content);
    that.$win.on('click', '[role=submit]', function(){
      callback(that.editor.codemirror.getValue());
      that.$win.modal('hide');
    });
  };

  global.EditorDialog = EditorDialog;
})(this);