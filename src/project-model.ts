
namespace App{
    // class Project
   export  enum EProjectStatus {active, completed}
   export  class Project {
        constructor(public id:string, public title:string, public description:string, public people:number, public status:EProjectStatus){}
    }
}