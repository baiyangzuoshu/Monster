import { Vec3 } from 'cc';
import { Vec2 } from 'cc';
import { _decorator, Component, Node } from 'cc';

export class NaviComponent {
    public vx: number = 0;
    public vy: number = 0;
    public speed: number;
    public pathList:Vec2[]=[];
    public time:number=0;
    public pathIndex:number=0;
}


