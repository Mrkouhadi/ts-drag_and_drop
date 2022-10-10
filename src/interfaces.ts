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
}