import React, { useState } from "react";

export const FormContext = React.createContext();

export function FormProvider({ children }) {
  const [formValue, setFormValue] = useState({
    errors: {
      institution: "Institution Name Is Required",
      subject: "Subject Is Required",
      yearOfPassing: "Year of passing Is Required",
      state: "State Is Required",
      city: "City Is Required",
      country: "Country Is Required",
      workInstitution: "Work Institution Name Is Required",
      experience: "Experience Is Required",
      role: "Role Is Required",
      startDate: "Start Date Is Required ",
      classSize: "Class Size Is Required",
      ageRangeFrom: "Age Range From Is Required",
      ageRangeTo: "Age Range To Is Required",
      workAddress1: "Work Address Is Required",
      workAddress2: "Work Address Is Required",
      workState: "Work State Is Required",
      workCity: "Work City Is Required",
      workCountry: "Work Country Is Required",
      workZipCode: "Work Zip Code Is Required",
    },
    educationData: [
      {
        institution: "",
        subject: "",
        yearOfPassing: "",
        state: "",
        city: "",
        country: "",
      },
    ],
    experienceData: [
      {
        workInstitution: "",
        subjectTaught: [],
        experience: "",
        role: "",
        startDate: "",
        endDate: "",
        classSize: "",
        ageRangeFrom: "",
        ageRangeTo: "",
        workAddress1: "",
        workAddress2: "",
        workState: "",
        workCity: "",
        workCountry: "",
        workZipCode: "",
        workInsWebsite: "",
      },
    ],
    profileData: [
      {
        ownSite: "",
        facebook: "",
        linkedIn: "",
        addInfo: "",
      },
    ],
  });

  return (
    <FormContext.Provider value={[formValue, setFormValue]}>
      {children}
    </FormContext.Provider>
  );
}
