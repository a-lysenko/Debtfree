module.exports = function (file) {
  var todos = file.todos;
  if (todos && todos.length) {
    todos.forEach(function (todo) {
      var arrayOfResults = /^\[(\d*)\].*/.exec(todo.text);
      if (arrayOfResults) {
        todo.priority = +arrayOfResults[1]; // convert to int
        console.log('priority ', todo.priority);
      }
      todo.title = generateTitle(todo);
      todo.description = generateDescription(todo);
      todo.priority = todo.priority || 0;
      delete todo.file;
      delete todo.kind;
      delete todo.line;
      delete todo.text;
    });
    todos.sort(function (first, second) {
      if (first.priority > second.priority) {
        return 1;
      } else if (first.priority < second.priority) {
        return -1;
      }
      return 0;
    });
  }
  return todos;
};

function generateTitle(todo) {
  return todo.kind + ': ' + todo.text;
}

function generateDescription(todo) {
  return 'File: ' + todo.file + ', line: ' + todo.line;
}
