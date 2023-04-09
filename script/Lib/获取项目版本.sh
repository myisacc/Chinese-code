cur_dir_=`dirname $BASH_SOURCE`
ProVersion='';
re="\"(version)\": \"([^\"]*)\"";
while read -r l; do
    if [[ $l =~ $re ]]; then
        value="${BASH_REMATCH[2]}";
        ProVersion="$value";
    fi
done < $cur_dir_/../../package.json;
