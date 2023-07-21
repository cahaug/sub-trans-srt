📝 Sub-Trans-SRT v1.2.0

A Batch Subtitle Translator compatible with SRT files.  

A queue of lines to be translated are extracted from each file and translated via a translation API. This process is repeated through a single file. When a file is complete, the next file begins.



✍️ Currently Supported Translation API:

-Yandex Translate ($75 Free Credit w/ Signup)

-Google Translate ($300-400 Free Credit w/ Signup)



✏️ Future Supported Translation API:

-Azure Translate

-NLP Translate



⚠️ You will need an API Key from one of these services to proceed with the translation.



💻 Usage:

The package can be used via npx by calling the following command:

npx sub-trans-srt start --dir='YOUR_DIRECTORY' --out='YOUR_DIRECTORY' --o=originLanguage --d=destinationLanguage --key='YOUR_API_KEY' --service=yandex --style=chooseYourStyle

OR:

npm run start -- --dir='YOUR_DIRECTORY' --out='YOUR_DIRECTORY' --o=originLanguage --d=destinationLanguage --key='YOUR_API_KEY' --service=yandex --style=chooseYourStyle



start - this runs the start script, which executes the batch translation.

--dir='' - this is the directory from your terminal to a folder which contains only the SRT files to be translated

--out='' - this is the directory from your terminal to a folder you wish to output the files into

--o='' - this is the 2/3-letter country code available from the list in the LanguageCodes.txt file in this directory. 

--d='' - this is the 2/3-letter country code available from the list in the LanguageCodes.txt file in this directory.

--key='' - this is your API Key as a string.  Yandex Translate (easy to create API key), Google Translate (create API key in Gcloud) is currently supported.

--service='' - Yandex Translate, Google Translate are currently supported in version 1.1.0, and should be selected with a string 'yandex' or 'google'

--style='' - two styles are available, 'add' and 'swap'.  Add inserts the translated line below its untranslated line, whereas swap removes the untranslated line and replaces it with the translated line.



🖱️ Example of Command Line Usage:

npx sub-trans-srt start --dir="./inDir" --out="./output" --o=ru --d=en --key="REDACTED" --service=yandex --style=add

npm run start -- --dir='.\origin\' --out='.\dest\' --o=en --d=fi --key='---------REDACTED------------' --service=google --style=swap

npm run start -- --dir='.\origin\' --out='.\dest2\' --o=en --d=fi --key='------------------------------REDACTED------------------------------------' --service=yandex --style=add



⚠️ Files will be output to the folder specified.  An Error may occur if the folders are not already in existence.



💽 Sub-Trans-SRT can also be run without arugments by modifying the default values present in sub-trans-srt.js, and running "node sub-trans-srt.js".



🤖 Programmatically, the module can be run via asynchronous function.  A sample implementation is attached in the file "sample.js".



🐛 Bug Fixes:

-Translations from Cyrillic Alphabet now supported (Arabic/Chinese/Japanese support to be added later)