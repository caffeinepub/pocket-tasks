import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  public type Task = {
    id : Nat;
    owner : Principal;
    title : Text;
    description : Text;
    isDone : Bool;
  };

  module Task {
    public func compare(task1 : Task, task2 : Task) : Order.Order {
      Nat.compare(task1.id, task2.id);
    };
  };

  var nextTaskId = 0;
  let tasks = Map.empty<Nat, Task>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Task management functions
  public shared ({ caller }) func createTask(title : Text, description : Text) : async Task {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create tasks");
    };

    if (title.size() == 0 or title.size() > 80) {
      Runtime.trap("Title must be between 1 and 80 characters");
    };

    let newTaskId = nextTaskId;
    nextTaskId += 1;

    let newTask : Task = {
      id = newTaskId;
      owner = caller;
      title;
      description;
      isDone = false;
    };

    tasks.add(newTaskId, newTask);
    newTask;
  };

  public query ({ caller }) func getTask(taskId : Nat) : async Task {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };

    switch (tasks.get(taskId)) {
      case (null) { Runtime.trap("Task not found") };
      case (?task) {
        if (task.owner != caller) {
          Runtime.trap("Unauthorized: You do not own this task");
        };
        task;
      };
    };
  };

  public query ({ caller }) func getAllTasks() : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };

    let userTasks = tasks.values().toArray().filter(func(task : Task) : Bool {
      task.owner == caller;
    });
    userTasks.sort();
  };

  public shared ({ caller }) func editTask(taskId : Nat, updatedTask : Task) : async Task {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can edit tasks");
    };

    if (not hasOwnership(caller, taskId)) {
      Runtime.trap("Unauthorized: You do not own this task");
    };

    if (not tasks.containsKey(taskId)) {
      Runtime.trap("Task not found");
    };

    let finalTask = {
      id = taskId;
      owner = caller;
      title = updatedTask.title;
      description = updatedTask.description;
      isDone = updatedTask.isDone;
    };

    tasks.add(taskId, finalTask);
    finalTask;
  };

  public shared ({ caller }) func toggleTask(taskId : Nat, isDone : Bool) : async Task {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can toggle tasks");
    };

    if (not hasOwnership(caller, taskId)) {
      Runtime.trap("Unauthorized: You do not own this task");
    };

    switch (tasks.get(taskId)) {
      case (null) { Runtime.trap("Task not found") };
      case (?task) {
        let updatedTask = {
          id = task.id;
          owner = task.owner;
          title = task.title;
          description = task.description;
          isDone = isDone;
        };
        tasks.add(taskId, updatedTask);
        updatedTask;
      };
    };
  };

  public shared ({ caller }) func deleteTask(taskId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete tasks");
    };

    if (not hasOwnership(caller, taskId)) {
      Runtime.trap("Unauthorized: You do not own this task");
    };

    if (not tasks.containsKey(taskId)) {
      Runtime.trap("Task not found");
    };

    tasks.remove(taskId);
  };

  public query ({ caller }) func getActiveTasks() : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };

    let userActiveTasks = tasks.values().toArray().filter(func(task : Task) : Bool {
      task.owner == caller and not task.isDone;
    });
    userActiveTasks.sort();
  };

  public query ({ caller }) func getCompletedTasks() : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };

    let userCompletedTasks = tasks.values().toArray().filter(func(task : Task) : Bool {
      task.owner == caller and task.isDone;
    });
    userCompletedTasks.sort();
  };

  func hasOwnership(caller : Principal, taskId : Nat) : Bool {
    switch (tasks.get(taskId)) {
      case (null) { false };
      case (?task) { task.owner == caller };
    };
  };
};
