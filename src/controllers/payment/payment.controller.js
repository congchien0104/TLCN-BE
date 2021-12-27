const db = require("../../models");
const randomstring = require("randomstring");
const { successResponse, errorResponse } = require("../../helpers/index");
const { User, Car, Reservation, Schedule, Route, CarSeat } = db;
const paypal = require('paypal-rest-sdk');
const paypalConfig = require('../../config/paypal');
paypal.configure(paypalConfig);

// const createReservation = async (req, res) => {
//   try {
//     const { userId } = req.user;
//     const carId = req.params.carId;
//     console.log(req.body);

//     const car = await Car.findOne({ where: { id: carId } });
//     if (!car) {
//       return res.send({ message: "Car not found!" });
//     }

//     const reservation = await Reservation.create({
//       receipt_number: randomstring.generate(10),
//       amount: req.body.amount,
//       paid_amount: req.body.paid_amount || 0,
//       paid_date: new Date(),
//       reservation_date: new Date(),
//       carId: carId,
//       userId: userId,
//       quantity: req.body.quantity,
//       fullname: req.body.fullname,
//       phone: req.body.phone,
//       email: req.body.email,
//     });

//     return successResponse(req, res, "Success");
//   } catch (error) {
//     return errorResponse(req, res, error.message);
//   }
// };

const createPaypal = async (req, res) => {
  const { arr, fullname, receipt_number, amount, reservations_date } = req.body;

  
  //Nếu thanh toán
  if (amount > 0) {
    const costUSD = Math.round((amount / 22600) * 100) / 100;
    console.log("ok", costUSD);
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `http://localhost:8080/payments/paypal?costUSD=${costUSD}`,
        cancel_url: "http://localhost:3000/payment-denied",
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: fullname,
                sku: receipt_number,
                price: costUSD,
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: costUSD,
          },
          description: receipt_number,
        },
      ],
    };
    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            //sendSuccess(res, payment.links[i].href, httpStatus.OK);
            Reservation.createReservation(req.body);
            //CarSeat.updateStatus(arr);
            return successResponse(req, res, payment.links[i].href);
          }
        }
      }
    });
  } else {
    // Nếu không thanh toán
    //return successResponse(req, res, "Đã thanh toán thành công");
    return errorResponse(req, res, "Đã thanh toán không thành công");
  }
  //   sendSuccess(res, {}, httpStatus.CREATED, 'Đã tạo cuộc hẹn');
};

const doPaymentServicePackage = async (req, res, next) => {
    // console.log("DkMMM");
    // res.send("okkkkkkkkkkk");
  const paymentId = req.query.paymentId;
  console.log(paymentId);
  const payerId = req.query.PayerID;
  const costUSD = req.query.costUSD;
  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: costUSD,
        },
      },
    ],
  };
  let success = true;
  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    function (error, payment) {
      if (error) {
        success = false;
        console.log(error.response);
      } else {
        console.log("Successfully paid");
      }
    }
  );
  //console.log(success, appointment, paymentType);
  if (!success) {
    //await appointmentService.deleteAppointment({ appointmentId: appointment });
    res.redirect("http://localhost:3000/payment-denied");
  } else {
    //const appointmentDetail = await appointmentService.getAppointmentById(appointment);
    //appointmentDetail.payment = paymentType;
    //await appointmentDetail.save();
    res.redirect("http://localhost:3000/payment-success");
  }
};

module.exports = {
  createPaypal,
  doPaymentServicePackage,
};
