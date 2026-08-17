/**
 * @file pxt-maqueen/maqueen.ts
 * @brief DFRobot's maqueen makecode library.
 * Defines shared constants and types used by the Maqueen v4 and v5 APIs.
 * @n [Get the module here](https://www.dfrobot.com.cn/goods-1802.html)
 * @n This is a MakeCode graphical programming education robot.
 *
 * @copyright    [DFRobot](http://www.dfrobot.com), 2016
 * @copyright    MIT
 *
 * @author [email](jie.tang@dfrobot.com)
 * @date  2019-10-08
*/
const MOTOR_ADDRESS = 0x10

enum PingUnit {
    //% block="cm"
    Centimeters,
}
enum state {
        state1=0x10,
        state2=0x11,
        state3=0x20,
        state4=0x21
    }
interface KV {
    key: state;
    action: Action;
}
