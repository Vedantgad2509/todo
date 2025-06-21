from flask import Flask, request, jsonify
from flask_cors import CORS

#flask app
app = Flask(__name__)
CORS(app)

todos = []

@app.route('/', methods=['GET'])
def get_todos():
    return jsonify(todos)

@app.route('/add', methods=['POST'])
def add_todo():
    data = request.get_json()
    task = data.get('task')
    time = data.get('time', '')
    if task:
        todos.append({'task': task, 'done': False, 'time': time})
        return jsonify({'message': 'Added'}), 201
    return jsonify({'error': 'Task required'}), 400

@app.route('/toggle/<int:index>', methods=['GET'])
def toggle(index):
    if 0 <= index < len(todos):
        todos[index]['done'] = not todos[index]['done']
        return jsonify({'message': 'Toggled'}), 200
    return jsonify({'error': 'Invalid index'}), 404

@app.route('/delete/<int:index>', methods=['GET'])
def delete(index):
    if 0 <= index < len(todos):
        todos.pop(index)
        return jsonify({'message': 'Deleted'}), 200
    return jsonify({'error': 'Invalid index'}), 404

if __name__ == '__main__':
    app.run(debug=True)
