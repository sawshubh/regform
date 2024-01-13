function writeToIDB(candidateData) {
  const db = new Dexie("candidateDB");
  db.version(1).stores({
    candidate: "++id, &emailId, &phoneNo, name, postalAddress",
  });
  db.open();
  db.candidate.add(candidateData).catch(function () {
    console.log("Email and Phone already registered");
  });
}
