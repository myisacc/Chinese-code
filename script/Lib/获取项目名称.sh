cur_dir_=`dirname $BASH_SOURCE`
ProName='';
re="\"(name)\": \"([^\"]*)\"";
while read -r l; do
    if [[ $l =~ $re ]]; then
        value="${BASH_REMATCH[2]}";
        ProName="$value";
    fi
done < $cur_dir_/../../package.json;
