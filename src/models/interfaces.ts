// interface for drag & drop
namespace App {
    export interface Idraggable{
        dragStartHandler(event: DragEvent):void;
        dragEndHandler(event:DragEvent):void;
    }
    export interface IDragTarget{
        dragOverHandler(event: DragEvent):void;
        dropHandler(event: DragEvent):void;
        dragLeaveHandler(event: DragEvent):void;
    }
    // interface of Validatable
    export interface Ivalidatable {
        value: string | number;
        required?:boolean;
        maxLength?:number
        minLength?:number
        min?:number;
        max?:number;
    }
}