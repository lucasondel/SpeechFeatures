var documenterSearchIndex = {"docs":
[{"location":"api/#API-1","page":"API","title":"API","text":"","category":"section"},{"location":"api/#","page":"API","title":"API","text":"here goes the public API","category":"page"},{"location":"feaextract/#Features-extraction-1","page":"Features extraction","title":"Features extraction","text":"","category":"section"},{"location":"feaextract/#Loading-an-audio-file-1","page":"Features extraction","title":"Loading an audio file","text":"","category":"section"},{"location":"feaextract/#","page":"Features extraction","title":"Features extraction","text":"To extract any type of speech features you will need the audio signal stored in an Array and the sampling rate in Hertz. The SpeechFeatures package does not provide a way to load these two elements from audio files directly but there are several Julia packages to do this. In this tutorial, we will use WAV.jl. For the rest of the tutorial, we assumed that you have installed the WAV.jl package in your Julia distribution.","category":"page"},{"location":"feaextract/#","page":"Features extraction","title":"Features extraction","text":"First of all, as an example, we download an audio file from the TIMIT corpus. In the Julia REPL prompt type:","category":"page"},{"location":"feaextract/#","page":"Features extraction","title":"Features extraction","text":"julia> run(`wget https://catalog.ldc.upenn.edu/desc/addenda/LDC93S1.wav`)","category":"page"},{"location":"feaextract/#","page":"Features extraction","title":"Features extraction","text":"Now, we load the audio waveform:","category":"page"},{"location":"feaextract/#","page":"Features extraction","title":"Features extraction","text":"julia> using WAV\njulia> channels, srate = wavread(\"LDC93S1.wav\", format = \"double\")","category":"page"},{"location":"feaextract/#","page":"Features extraction","title":"Features extraction","text":"Where channels is a NxC matrix where N is the length of the audio in samples and C is the number of channels. Since TIMIT is mono recorded it has only one channel. format = \"double\" indicates that the signals in channels will be encoded with double precision and each sample of the signal will be between 1.0 and -1.0.","category":"page"},{"location":"feaextract/#","page":"Features extraction","title":"Features extraction","text":"warning: Warning\nThe wavread function also accepts format = \"native\" which will return the data in the format it is stored in the WAV file. We discourage its use as extracting the features from integer or floating point encoded signal can lead to drastically different output.","category":"page"},{"location":"feaextract/#","page":"Features extraction","title":"Features extraction","text":"We get the signal from the channels matrix:","category":"page"},{"location":"feaextract/#","page":"Features extraction","title":"Features extraction","text":"julia> x = channels[:, 1]\njulia> x *= typemax(Int16)","category":"page"},{"location":"feaextract/#","page":"Features extraction","title":"Features extraction","text":"The line x *= typemax(Int16) scales the signal to the same range as if it had been stored in 16 bits integer format. This is step is not necessary but it will allow us to have a setup very similar to HTK or Kaldi.","category":"page"},{"location":"feaextract/#","page":"Features extraction","title":"Features extraction","text":"As a sanity check, we print the sampling rate and duration of the signal:","category":"page"},{"location":"feaextract/#","page":"Features extraction","title":"Features extraction","text":"julia> println(\"sampling freq: $srate Hz\\nduration: $(round(length(x) / srate, digits=2)) s\")\nsampling freq: 16000.0 Hz\nduration: 2.92 s","category":"page"},{"location":"feaextract/#","page":"Features extraction","title":"Features extraction","text":"and we plot the waveform:","category":"page"},{"location":"feaextract/#","page":"Features extraction","title":"Features extraction","text":"julia> using Plots\njulia> pyplot()\njulia> t = range(0, length(x) / srate, length=length(x))\njulia> plot(t, x, size = (1000, 300), xlabel = \"time (seconds)\", legend = false)","category":"page"},{"location":"feaextract/#","page":"Features extraction","title":"Features extraction","text":"(Image: alternative text)","category":"page"},{"location":"feaextract/#Extracting-the-features-1","page":"Features extraction","title":"Extracting the features","text":"","category":"section"},{"location":"feaextract/#","page":"Features extraction","title":"Features extraction","text":"All the different types of features supported by this package follow the same extraction scheme.","category":"page"},{"location":"feaextract/#","page":"Features extraction","title":"Features extraction","text":"create a the feature extractor object with a specific configuration\nsend the signal(s) to this extractor to get the features.","category":"page"},{"location":"feaextract/#","page":"Features extraction","title":"Features extraction","text":"As an example, we will show how to extract the popular Mel Frequency Cepstral Coefficients (MFCC) features. First we create the extractor with the default configuration:","category":"page"},{"location":"feaextract/#","page":"Features extraction","title":"Features extraction","text":"julia> mfcc = MFCC(srate = srate)","category":"page"},{"location":"feaextract/#","page":"Features extraction","title":"Features extraction","text":"If srate is not specified the extractor assumes a 16 kHz sampling rate.","category":"page"},{"location":"feaextract/#","page":"Features extraction","title":"Features extraction","text":"Now, we extract and plot the features from our TIMIT sample:","category":"page"},{"location":"feaextract/#","page":"Features extraction","title":"Features extraction","text":"julia> fea = x |> mfcc\njulia> heatmap(range(0, length(x) / srate, length = size(fea, 2)),\n               1:size(fea, 1), fea, xlabel = \"time (s)\", c = :viridis)","category":"page"},{"location":"feaextract/#","page":"Features extraction","title":"Features extraction","text":"(Image: alternative text)","category":"page"},{"location":"feaextract/#Deltas-and-acceleration-coefficients-1","page":"Features extraction","title":"Deltas and acceleration coefficients","text":"","category":"section"},{"location":"feaextract/#","page":"Features extraction","title":"Features extraction","text":"Features The deltas and acceleration coefficients (i.e. \"double deltas\") are easily computed by chaining the features extraction with the deltas features extractor:","category":"page"},{"location":"feaextract/#","page":"Features extraction","title":"Features extraction","text":"julia> Δ_ΔΔ = DeltaCoeffs(order = 2)\njulia> fea = x |> mfcc |> Δ_ΔΔ","category":"page"},{"location":"feaextract/#","page":"Features extraction","title":"Features extraction","text":"The order parameter is the order of the deltas coefficients, i.e. order = 2 means that the first and second deltas (acceleration) coefficients will be computed.","category":"page"},{"location":"feaextract/#Supported-features-1","page":"Features extraction","title":"Supported features","text":"","category":"section"},{"location":"feaextract/#Compatibility-with-HTK-1","page":"Features extraction","title":"Compatibility with HTK","text":"","category":"section"},{"location":"feaextract/#Compatibility-with-Kaldi-1","page":"Features extraction","title":"Compatibility with Kaldi","text":"","category":"section"},{"location":"install/#Installation-1","page":"Installation","title":"Installation","text":"","category":"section"},{"location":"install/#Installation-of-Julia-1","page":"Installation","title":"Installation of Julia","text":"","category":"section"},{"location":"install/#","page":"Installation","title":"Installation","text":"The SpeechFeatures package was developped with Julia 1.4.1. If you haven't installed Julia already, follow the instruction here.","category":"page"},{"location":"install/#","page":"Installation","title":"Installation","text":"tip: Tip\nIt is a common practice in Julia to use non-ascii characters while coding such as greek letters or mathematical symbols. We highly recommend to add Julia support to your editor to easily access these special characters. Plugin for vim/neovim and emacs can be found here.","category":"page"},{"location":"install/#Installation-of-SpeechFeatures-1","page":"Installation","title":"Installation of SpeechFeatures","text":"","category":"section"},{"location":"install/#","page":"Installation","title":"Installation","text":"In the Julia REPL prompt, press ] to enther the Pkg REPL and then type:","category":"page"},{"location":"install/#","page":"Installation","title":"Installation","text":"(@v1.4) pkg> add https://github.com/BUTSpeechFIT/SpeechFeatures","category":"page"},{"location":"install/#","page":"Installation","title":"Installation","text":"This will install the package along with its dependencies into your Julia installation.","category":"page"},{"location":"#SpeechFeatures.jl-Documentation-1","page":"Home","title":"SpeechFeatures.jl Documentation","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"SpeechFeatures is a Julia package for extracting classical speech features from audio waveform.","category":"page"},{"location":"#References-1","page":"Home","title":"References","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"Lucas Ondel, Brno University of technology. SpeechFeatures: a Julia package for speech features extraction.","category":"page"},{"location":"#Manual-Outline-1","page":"Home","title":"Manual Outline","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"Pages = [\"install.md\", \"feaextract.md\"]","category":"page"}]
}
