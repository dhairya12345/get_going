const inputs = document.querySelectorAll('.inputtext');

    inputs.forEach(input => {
        const placeholder = input.previousElementSibling;
       
        input.addEventListener('input',()=>{
            if(event.target.value.trim()==="")
            {

            }
            else{
                placeholder.style.transform='translateY(-135%)';
                input.style.borderColor = "rgb(31, 178, 31)";
                placeholder.style.color = "rgb(31, 178, 31)";
                placeholder.style.backgroundColor = "#ddd9d9";
            }
        });
        input.addEventListener('focus',()=>{
          
            placeholder.style.transform='translateY(-135%)';
            input.style.borderColor = "rgb(31, 178, 31)";
            placeholder.style.color = "rgb(31, 178, 31)";
            placeholder.style.backgroundColor = "#ddd9d9";
           
        });
        input.addEventListener('blur',()=>{
            let textvalue = event.target.value;
            if(textvalue.trim() === "")
        {
            placeholder.style.transform='translateY(0)';
            input.style.borderColor = "rgba(0, 0, 0, 0.739)";
            placeholder.style.color = "rgb(137, 136, 136)";
        }
           
        });
    });