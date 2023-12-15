const postAppointment = require("../controllers/postAppointment")
const sendEmailDate= require('../controllers/notifications/sendEmailDate')
const {Doctor, Patient, Specialty}= require('../db.js')


const handlerPostAppointment=async(req, res)=>{

    const {date, time, idPatient, idDoctor, price}= req.body
    
    try {
        const newAppointment= await postAppointment(date, time, idPatient, idDoctor, price)

        const doctor = await Doctor.findByPk(idDoctor);
        const patient= await Patient.findByPk(idPatient);
        const specialty = await Specialty.findByPk(doctor.dataValues.SpecialtyId);

        const dataAppointment={
            id: doctor.dataValues.id,
            email:patient.dataValues.email,
            doctor: doctor.dataValues.name,
            date: date,
            time: time,
            specialty: specialty.dataValues.name,
          }
         
        await sendEmailDate(dataAppointment);
        
        res.status(200).send({ message: "Reserved appointment", newAppointment })
    } catch (error) {
        res.status(500).send(error.message)
    }
}   

module.exports = {handlerPostAppointment}