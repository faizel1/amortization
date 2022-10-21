

var wwOpenInstalled;
if (wwOpenInstalled || parent.wwOpenInstalled) {
	if (window.Event) {
		document.captureEvents (Event.MOUSEUP);
	}
	document.onmouseup = (parent.wwOpenInstalled) ? parent.wwOnMouseUp : wwOnMouseUp;
}

function pdfCallback(pdfObject) {
    var number_of_pages = pdfObject.internal.getNumberOfPages()
    var pdf_pages = pdfObject.internal.pages
    var myFooter = "Footer info"
    for (var i = 1; i < pdf_pages.length; i++) {
        // We are telling our pdfObject that we are now working on this page
        pdfObject.setPage(i)

        pdfObject.text("my header text", 10, 10)

        // The 10,200 value is only for A4 landscape. You need to define your own for other page sizes
        pdfObject.text(myFooter, 10, 200)
    }
}

function generatePdf() {
	var today = new Date();
	var date =
	  today.getFullYear() +
	  "-" +
	  (today.getMonth() + 1) +
	  "-" +
	  today.getDate();
	var time =
	  today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	var dateTime = date + " " + time;

	var element = document.getElementById("pdf");

	const name = "amortization".concat(dateTime, ".pdf");
	console.log("first,name");
	var opt = {
	  margin: 1,
	  filename: name,
	  image: { type: "jpeg", quality: 0.98 },
	  html2canvas: { scale: 2 },
	  jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
	  pdfCallback: pdfCallback

	};

	// New Promise-based usage:
	html2pdf().set(opt).from(element).save();
	// html2pdf().from(element).save();

	// Old monolithic-style usage:
	// html2pdf(element, opt);
  }
function getValues()
{
	var year = parseInt(document.getElementById("year").value);
	const month =parseInt (document.querySelector('#month').value);
	const day = parseInt(document.querySelector('#day').value);

	//button click gets values from inputs
	var balance = parseFloat(document.getElementById("principal").value);
	var interestRate = 	parseFloat(document.getElementById("interest").value/100.0);
	var terms = parseInt(document.getElementById("terms").value);
	
	//set the div string
	var div = document.getElementById("Result");
	
	//in case of a re-calc, clear out the div!
	div.innerHTML = "";
	
//validation area

const yearValidation=(isNaN(year) || year < 2022 || year>2100 );
const monthValidation=(isNaN(month) || month < 1 || month>12);
const dayValidation=(isNaN(day) || day < 1 ||day >31 );
const balanceValidation=(isNaN(balance) || balance <= 0 );
const interestValidation=(interestRate <= 0 );
const termsValidation=(isNaN(terms) || terms <= 0 );


//validate inputs - display error if invalid, otherwise, display table
	// var balVal = validateInputs(balance);
	// var intrVal = validateInputs(interestRate);
let errorText="";
if(yearValidation){
	errorText=validationString("year")
}
else if(monthValidation)
{
	errorText=validationString("month")

}
else if(dayValidation)
{
	errorText=validationString("day")

}
else if(balanceValidation)
{
	errorText=validationString("balance")

}else if(interestValidation)
{
	errorText=validationString("interest Rate")

}
else if(termsValidation)
{

	errorText=validationString("terms")

}

if(errorText!=""){

			//returns error if inputs are invalid
			div.innerHTML += errorText;
}


	else{

console.log("first",yearValidation,monthValidation,dayValidation,balanceValidation,interestValidation,termsValidation)
		//Returns div string if inputs are valid
		document.getElementById("input").style.display = "none";
		document.getElementById("generatePdf").style.display = "none";
		document.getElementById("printDocument").style.display = "block";
		document.getElementById("clearData").style.display = "block";

// document.getElementsByClassName("input").style.display="none";
		div.innerHTML += amort(balance, interestRate, terms,year,month,day);


		
	}
	
	


	
}

/**
 * Amort function:
 * Calculates the necessary elements of the loan using the supplied user input
 * and then displays each months updated amortization schedule on the page
*/
function amort(balance, interestRate, terms,year,month,day,date)
{
    //Calculate the per month interest rate
	var monthlyRate = interestRate/12;
	
	//Calculate the payment
    var payment = balance * (monthlyRate/(1-Math.pow(
        1+monthlyRate, -terms)));
	    
		var date=new Date(year,month-1,day).toDateString().replace(/\s/g, '/');
	//begin building the return string for the display of the amort table
    var result1 = 
	" <h5> Loan Date : " + (date) +  "<br />  " + 
	"  Loan Amount : " + balance.toFixed(2) +  "<br />  " + 
        " Interest Rate: " + (interestRate*100).toFixed(2) +  "%<br />" +
        " Number of Months: " + terms + "<br />" +
        " Monthly Payment: " + payment.toFixed(2) + "<br /> " +
        " Total Paid: " + (payment * terms).toFixed(2) + " </h5><br />";
        
        document.getElementById("leftData").innerHTML =result1;

    //add header row for table to return string
	var result = `
	
	<table border=0  class='styled-table' style=margin-left:5vw;margin-top:10vh >
	
	<caption style=color:gold;font-size:30px >Year 1</caption>
	<thead>
        <tr>

			<th>Month #</th><th>Payment Date</th><th>Balance</th>
			<th>Interest</th><th>Principal</th>

        </tr>
    </thead>

	 `
	// + 
    //     "<th>Interest</th><th>Principal</th>";

    	// <th>Month #</th><th>Date #</th><th>Balance</th>

    /**
     * Loop that calculates the monthly Loan amortization amounts then adds 
     * them to the return string 
     */
	for (var count = 0; count < terms; ++count)
	{ 
		// let m = new Date(year,month,day)
		let m = new Date(year,month+count,day).toDateString().replace(/\s/g, '/')

		// console.log("m",m)
		//in-loop interest amount holder
		var interest = 0;
		
		//in-loop monthly principal amount holder
		var monthlyPrincipal = 0;
		
        if(count%12 ==0 && count!= 0 ){
			 result += `
			</td>
			</tr>
			</tbody>
			<table border=0  class='styled-table page-break' 
			 	style=page-break-after:always;margin-left:5vw;margin-top:10vh
		
			>
			<caption style=color:gold;font-size:30px >
			Year ${count/12 +1}
		  </caption>
			<thead>
				<tr>
		
					<th>Month #</th><th>Date #</th><th> Principal</th>
					<th>Interest</th><th>Balance</th>
		
				</tr>
			</thead>
		
			 `

			// result+="<h1 id='myFooter' style=display: block; page-break-after: always; >Page Break</h1>"
	
			// result+="<tr class=pageEnd><td class=page-break></td></tr>"
		

		}
		else{

		}

   
		//start a new table row on each loop iteration
		result += "<tr align=center>";
		
		//display the month number in col 1 using the loop count variable
		result += "<td>" + (count + 1) + "</td>";
		result += "<td>" + (m) + "</td>";
		interest = balance * monthlyRate;

	    //calc the in-loop monthly principal and display
    	monthlyPrincipal = payment - interest;
    	result += "<td> " + monthlyPrincipal.toFixed(2) + "  </td>";
		

		
		//calc the in-loop interest amount and display
		// interest = balance * monthlyRate;
		result += "<td> " + interest.toFixed(2) + "  </td>";
		
		//code for displaying in loop balance
		result += "<td> " + balance.toFixed(2) + "  </td>";
		
		//end the table row on each iteration of the loop	
		result += "</tr>";
		
		//update the balance for each loop iteration
		balance = balance - monthlyPrincipal;		
	}
	
	//Final piece added to return string before returning it - closes the table
    result += "</table>";
	
	//returns the concatenated string to the page
    return result;
}

function validationString(string)
{
	//some code here to validate inputs
return "<h2 style=margin-top:400px;color:red; >Please Check your <span style=color:green >'"+string+"' </span> </h2>"
}

