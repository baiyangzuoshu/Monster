import { BulletEntity } from "../Entity/BulletEntity";
import { MonsterEntity } from "../Entity/MonsterEntity";

export class CollisionSystem  {
    public static checkCollision(entity1:BulletEntity, entity2:MonsterEntity):boolean {
        var pos1 = entity1.baseCompnent.gameObject.position;
        var pos2 = entity2.baseCompnent.gameObject.position;
    
        var size1 = entity1.collisionComponent.size;
        var size2 = entity2.collisionComponent.size;
    
        // Detect if two rectangles intersect
        var left1 = pos1.x;
        var right1 = pos1.x + size1.width;
        var top1 = pos1.y;
        var bottom1 = pos1.y + size1.height;
    
        var left2 = pos2.x;
        var right2 = pos2.x + size2.width;
        var top2 = pos2.y;
        var bottom2 = pos2.y + size2.height;
    
        if (left1 < right2 && right1 > left2 && top1 < bottom2 && bottom1 > top2) {
            entity1.baseCompnent.gameObject.active = false;
            return true;
        }
    
        return false;
    }
    
}


