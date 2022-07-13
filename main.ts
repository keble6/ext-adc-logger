function writeCONFIG (num: number) {
    // Write CONFIG reg address
    pins.i2cWriteNumber(
    ADCaddress,
    CONFIG,
    NumberFormat.UInt8LE,
    true
    )
    // Write num to CONFIG reg
    pins.i2cWriteNumber(
    ADCaddress,
    configValue,
    NumberFormat.UInt16BE,
    false
    )
}
function writeADDRESS (num: number) {
    // Write CONFIG reg address
    pins.i2cWriteNumber(
    ADCaddress,
    CONFIG,
    NumberFormat.UInt8LE,
    true
    )
    // Write 0 (the CONVERSION) reg
    pins.i2cWriteNumber(
    ADCaddress,
    0,
    NumberFormat.UInt8LE,
    false
    )
}
// CONFIG Bit fields: 15 = OS 14:12 = MUX 11:9 = PGA 8 = MODE
function readCONVERSION () {
    return pins.i2cReadNumber(ADCaddress, NumberFormat.UInt16BE, false)
}
let busy = false
let configValue = 0
let CONFIG = 0
let ADCaddress = 0
let CONVERSION = 0
// slave address
ADCaddress = 144
// Register 0
// Register 1
CONFIG = 1
let OS = 0
let MUX = 0
// Bit field: Gain = +/- 2.058V
let PGA = 2
// Bit field: Mode = single shot
let MODE = 1
let DIS = 3
configValue = BitwiseLogic.bitwise2arg(OS, operator.leftShift, 15)
configValue = BitwiseLogic.bitwise2arg(configValue, operator.or, BitwiseLogic.bitwise2arg(MUX, operator.leftShift, 12))
configValue = BitwiseLogic.bitwise2arg(configValue, operator.or, BitwiseLogic.bitwise2arg(PGA, operator.leftShift, 9))
configValue = BitwiseLogic.bitwise2arg(configValue, operator.or, BitwiseLogic.bitwise2arg(MODE, operator.leftShift, 8))
configValue = BitwiseLogic.bitwise2arg(configValue, operator.or, BitwiseLogic.bitwise2arg(DIS, operator.leftShift, 0))
writeCONFIG(configValue)
loops.everyInterval(1000, function () {
    busy = true
    while (busy) {
        busy = readCONVERSION() % 32768
    }
})
