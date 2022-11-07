"use strict";


window.onload = () => {

  const env = window.ENV
  const courseId = env.COURSE_ID;
  const href = window.location.href;
  const lessonId = href.match(/(pages|assignments|quizzes|discussion_topics)\/[a-zA-Z-0-9]+/g) ? href.match(/(pages|assignments|quizzes|discussion_topics)\/[a-zA-Z-0-9]+/g)[0].replace(/(pages|assignments|quizzes|discussion_topics)\//g, "") : "None";
  const lessonType = href.match(/courses\/[0-9]+\/[a-zA-Z-_]+/g) ? href.match(/courses\/[0-9]+\/[a-zA-Z-_]+/g)[0].replace(/courses\/[0-9]+\//g, "") : "None";
  const header = document.querySelector('.fis-header');

  if (!!header) {
    header.style.visibility = 'visible'
    adjustHeader(lessonType, courseId, lessonId);
  }

  // DS Illumidesk specific - reduces default height of illumidesk page
  let illumideskWrapper = document.querySelector('.tool_content_wrapper');

  if (!!illumideskWrapper) {
    if (illumideskWrapper.children[0].action.includes('illumidesk')) {
      illumideskWrapper.classList.add('no-height')
      let iframe = document.querySelector('#tool_content');
      if (!!iframe) iframe.classList.add('i-height')
    }
  }

};


  /*
  imports from ms instructure STARTS
  */


$(document).ready(function() {
    // Handler for .ready() called.
    $('button.offline_web_export').hide();
    $('input#course_organize_epub_by_content_type').hide();
});



// Zendesk Widget

var customLoadZendeskWidget = function() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.id = 'ze-snippet';
    script.async = true;
    script.src = 'https://static.zdassets.com/ekr/snippet.js?key=0532414e-ffa9-4278-9570-fff17d90b2e4';
    document.getElementsByTagName('head')[0].appendChild(script);
};

/* ------------------ END FUNCTION SECTION */

/* ------------------ RUN ON PAGE LOAD */

var current_name = null;
var current_email = null;
var current_course = null;

$(
//document.addEventListener("DOMContentLoaded",
function () {
//window.onload = function () {
    customLoadZendeskWidget();
    

      
    $.get('/api/v1/users/self/profile', function(profile) {
        console.log(JSON.stringify(profile));
        current_name = profile.name;
        current_email = profile.primary_email;
  
        zE('webWidget', 'updateSettings', {
            webWidget: {
            contactForm: {
                fields: [
                    { id: 'name', prefill: { '*': current_name } },
                    { id: 'email', prefill: { '*': current_email } }
                    ]
                }
            }
          });
    });
  
  
    
    
  //   get course id
    var url = window.location.href;
    if(url.includes('courses/')){
        var course_str = url.substr(url.indexOf('course'));
        var segments = course_str.split('/');
        console.log('course ID'+segments[1]);
        $.get('/api/v1/courses/'+segments[1], function(course) {
            console.log(JSON.stringify(course));
            current_course = course;
  
            zE('webWidget', 'updateSettings', {
                webWidget: {
                    contactForm: {
                        title: {
                            '*': course.course_code+' Support'
                        },
                        subject: true,
                        fields: [{ id:'subject', prefill: { '*': course.course_code+' Technical Support'}}]
                    }
                }
              });

        });  
    }
    /*
    ----------------------------------------------
    *Dynamically add Topic Feedback START
    ---------------------------------------------
    */


    // function createFragment(htmlStr){
    //     var fragment = document.createDocumentFragment(),
    //     $element = document.createElement('div');

    //     $element.innerHTML = htmlStr;
    //     while($element.firstChild){
    //         fragment.appendChild($element.firstChild);
    //     }
    //     return fragment;
    // }

    // var $target = document.querySelector('.show-content');
    // htmlStr = `HELLO WORLD!!!!`;
    // htmlStr = `<iframe id="fs-iframe" title="Content Page Rating" src="https://moringa.formstack.com/forms/student_contract_copy" width="100%" height="400x"></iframe>`
    // $target.appendChild(createFragment(htmlStr));
    /*
    ----------------------------------------------
    *Dynamically add Topic Feedback END
    ---------------------------------------------
    */



    /*
    ----------------------------------------------
    *Populate Formstack Feedback form START
    ---------------------------------------------
    */
    waitForElm('#fs-iframe').then((elm) => {
        console.log('Element is ready');
        console.log(elm.textContent);
        populateFormStackForm(elm);
    });
    

    /*
    ----------------------------------------------
    *Populate Formstack Feedback form END
    ---------------------------------------------
    */
}
);


function populateFormStackForm(fs_iframe){
    //const fs_iframe = document.getElementById("fs-iframe"); //find the iframe with Formstack
    console.log('fs-frame::'+ fs_iframe);
    if(fs_iframe==null)return;
    // Make sure the iframe is loaded
    fs_iframe.addEventListener("load", function(){
       var data = {}
        const url = window.location.href;

        console.log(`Formstack URL:: ${url}`)

        if(url.includes('courses/')){
            let course_str = url.substr(url.indexOf('course'));
            let course_segments = course_str.split('/');
            let page_str = url.substr(url.indexOf('pages'));
            let page_segments = page_str.split('/');
            console.log('course ID'+course_segments[1]);
            console.log('Page Title'+page_segments[1]);
            
            // Retrieve course information
            $.get('/api/v1/courses/'+course_segments[1], function(course) {
                let current_course = course.course_code;
                let course_start = course.start_at
                let course_end = course.end_at
                let courseId = course.id
                // let course_sis_id = course.sis_course_id

                console.log(`Current course Info::${current_course}`)

                if (!/\d+/.test(current_course)){
                    
                    console.log("Course Offering does not have term number included")
                    return
                }
                if(!course_start||!course_end){
                    console.log("This Course Offering is either Blueprint or does not have start or end date included")
                    return
                }

                data["course_code"] =  current_course
                data["course_start"] = course_start.split("T")[0]
                data["course_end"] = course_end.split("T")[0]

               
                if (current_course.toLocaleLowerCase().includes("PT")){

                    data["term"] = `${current_course.slice(0, 4)}${current_course.match(/\d+/)[0]}`
                }else{
                    data["term"] = `${current_course.slice(0, 2)}${current_course.match(/\d+/)[0]}`
                }
                //*Retrieve sections
                $.get(`/api/v1/courses/${course_segments[1]}/sections?include[]=total_students`, function(sectionList) {
                    var max = 0
                    var primarySectionId = 0
                    for(var i=0; i<sectionList.length; i++){   
                        if(max <  sectionList[i].total_students){
                            max = sectionList[i].total_students
                        }
                    }
                    for(var i=0; i<sectionList.length; i++){   
                        if(max === sectionList[i].total_students){
                            primarySectionId = sectionList[i].id
                        }
                    }
                    // Get Page info for content feedback
                    $.get(`/api/v1/courses/${course_segments[1]}/pages/${page_segments[1]}`, function(page) { 

                        var page_title = page.title
                        var page_id = page.page_id
                        var page_created_at = page.created_at
                        var page_updated_at = page.updated_at
                        var page_url = page.html_url
                        var _url = page.url

                        console.log(`Page url: ${page_url}`)

                        data["page_title"] = page_title
                        data["page_id"] = page_id
                        data["page_created_at"] = page_created_at 
                        data["page_updated_at"] = page_updated_at
                        data["page_url"] = page_url
                        data["_url"] = _url


                        // Get enrollment ID
                        
                        // Get Profile of user
                        $.get('/api/v1/users/self/profile', function(profile) {
                            // Get the current user profile
                            
                            
                            //console.log(JSON.stringify(profile));
                           var current_user_id = profile.id;
                           var current_user_name = profile.name;
                           var current_user_email = profile.primary_email;
                           var current_sis_id = profile.sis_user_id;
                            
                            // debugg log
                            console.log(current_user_id);
                            console.log(current_user_email);
                            
                            // data object
                            data["id"] =  current_user_id
                            data["name"] =  current_user_name
                            data["email"] =  current_user_email
                            data["SIS_Id"] = current_sis_id
                            
                            
                            // debugg log
                            console.log(`Canvas:: User ID ${current_user_id}`);
                            console.log(current_user_email);
                            
                            
                            // data object
                            data["id"] =  current_user_id
                            data["name"] =  current_user_name
                            // data["email"] =  current_user_email
                            data["SIS_Id"] = current_sis_id
                            
                            
                            $.get(`/api/v1/courses/${courseId}/enrollments?user_id=${current_user_id}`, function(enrollmentsList) {
                                // Getting the section enrollment. 
                                var current_LMS_id;
                                let enrollment
                                for(var i=0; i<enrollmentsList.length; i++){   
                                    if(primarySectionId !==  enrollmentsList[i].course_id){
                                        enrollment = enrollmentsList[i]
                                    }
                                }
                                if(enrollment){
                                     current_LMS_id = enrollment.id
                                }else{
                                     current_LMS_id = 0;
                                }
                               
                                console.log(`Canvas:: LMS ID ${current_LMS_id}`);
                                data["LMS_Id"] = current_LMS_id


                                console.log(data["SIS_Id"])
                                console.log(data["course_code"])
                                fs_iframe.contentWindow.postMessage(data, "*")
                                console.log("I. data passed")

                            }); 

                        });
                    });

                });

            });  
        }    
    })
}



function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}


  /*
  imports from MS instructure ENDS
  */