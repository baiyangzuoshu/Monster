import { GameState } from "../../Enum";

export default class UnitComponent  {
    public hp:number=0;
    public gold:number=0;
    public atk:number=0;
    public angle:number=0;
    public state:GameState=GameState.Normal;
    public m_attackTarget:cc.Node=null;
    public isDead:boolean=false;
    public fireTime:number=0;
}
