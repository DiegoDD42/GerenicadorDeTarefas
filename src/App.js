import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, ListGroup, Badge, Alert } from 'react-bootstrap';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState('Baixa');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [show, setShow] = useState(false);

  const priorityMap = {
    'Baixa': 1,
    'Média': 2,
    'Alta': 3,
  }

  const addTask = () => {
    if (taskName && taskDueDate) {
      const newTask = {
        name: taskName,
        description: taskDescription,
        priority: taskPriority,
        priorityValue: priorityMap[taskPriority],
        dueDate: new Date(taskDueDate),
        completed: taskCompleted,
      };
      setTasks([...tasks, newTask]);
      clearForm();
    } else {
      setShow(true)
    }
  };

  const clearForm = () => {
    setTaskName('');
    setTaskDescription('');
    setTaskPriority('Baixa');
    setTaskDueDate('');
    setTaskCompleted(false);
    setEditingIndex(null);
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const editTask = (index) => {
    const taskToEdit = tasks[index];
    setTaskName(taskToEdit.name);
    setTaskDescription(taskToEdit.description);
    setTaskPriority(taskToEdit.priority);
    setTaskDueDate(taskToEdit.dueDate.toISOString().split('T')[0]);
    setTaskCompleted(taskToEdit.completed);
    setEditingIndex(index);
  };

  const updateTask = () => {
    if (editingIndex !== null) {
      const updatedTask = {
        name: taskName,
        description: taskDescription,
        priority: taskPriority,
        priorityValue: priorityMap[taskPriority],
        dueDate: new Date(taskDueDate),
        completed: taskCompleted,
      };
      const updatedTasks = tasks.map((task, index) =>
        index === editingIndex ? updatedTask : task
      );
      setTasks(updatedTasks);
      clearForm();
    }
  };

  const toggleCompleteTask = (index) => {
    const updatedTasks = tasks.map((task, i) => {
      if (i === index) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const calculateDaysRemaining = (dueDate) => {
    const currentDate = new Date();
    const timeDiff = dueDate - currentDate;
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  if (show){
    return(
      <Alert variant='warning' onClose={() => setShow(false)} dismissible>
        É necessário inserir um nome e uma data de vencimento à tarefa!!! 
      </Alert>
    )
  }

  return (
    <Container>
      {show && (
        <Alert variant='warning' onClose={() => setShow(false)} dismissible>
          É necessário inserir um nome e uma data de vencimento à tarefa!!! 
        </Alert>
      )}
      <h1 className="my-4 text-center">Gerenciador de Tarefas</h1>
      <Row>
        <Col md={6}>
          <Form>
            <Form.Group controlId="formTaskName" className="mb-3">
              <Form.Label>Nome da Tarefa</Form.Label>
              <Form.Control
                type="text"
                placeholder="Insira o nome da tarefa"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formTaskDescription" className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Insira uma descrição"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formTaskPriority" className="mb-3">
              <Form.Label>Prioridade</Form.Label>
              <Form.Select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
              >
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="formTaskDueDate" className="mb-3">
              <Form.Label>Data de Vencimento</Form.Label>
              <Form.Control
                type="date"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formTaskCompleted" className="mb-3">
              <Form.Check
                type="checkbox"
                label="Concluída"
                checked={taskCompleted}
                onChange={(e) => setTaskCompleted(e.target.checked)}
              />
            </Form.Group>

            <Button variant="primary" onClick={editingIndex !== null ? updateTask : addTask} className="me-2">
              {editingIndex !== null ? 'Atualizar Tarefa' : 'Adicionar Tarefa'}
            </Button>
            <Button variant="secondary" onClick={clearForm}>Limpar</Button>
          </Form>
        </Col>

        <Col md={6}>
          <h2>Lista de Tarefas</h2>
          {tasks.length === 0 ? (
            <Alert variant="info">Nenhuma tarefa adicionada ainda.</Alert>
          ) : (
            <ListGroup>
              {tasks.map((task, index) => (
                <ListGroup.Item
                  key={index}
                  className={task.completed ? 'bg-success text-white' : ''}
                >
                  <Row>
                    <Col md={8}>
                      <h5>{task.name} <Badge bg={task.priority === 'Alta' ? 'danger' : task.priority === 'Média' ? 'warning' : 'secondary'}>{task.priority}</Badge></h5>
                      <p>{task.description}</p>
                      <p>Prioridade (Valor Numérico): {task.priorityValue}</p>
                      <p>Vencimento: {task.dueDate.toLocaleDateString()}</p>
                      <p>Dias Restantes: {calculateDaysRemaining(task.dueDate)} dias</p>
                      <p>Status: {task.completed ? 'Concluída' : 'Pendente'}</p>
                    </Col>
                    <Col md={4} className="text-end">
                      <Button variant={task.completed ? 'light' : 'success'} onClick={() => toggleCompleteTask(index)} className="m-2">
                        {task.completed ? 'Desmarcar' : 'Marcar'} como Concluída
                      </Button>
                      <Button variant="warning" onClick={() => editTask(index)} className="m-2">Editar</Button>
                      <Button variant="danger" onClick={() => deleteTask(index)} className="m-2">Excluir</Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default App;
